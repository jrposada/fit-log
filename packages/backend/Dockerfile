# syntax=docker/dockerfile:1
#
# Backend image, including the video-to-3D reconstruction toolchain
# (colmap + ffmpeg from apt, OpenMVS built from source — no OpenMVS package
# exists for Debian/Ubuntu). Build from the repo root:
#
#   docker build -f packages/backend/Dockerfile --target runtime -t fit-log-backend .
#
# Two usable targets:
#   - `dev`:     OS toolchain only. Used by docker-compose (`backend` service)
#                with the repo bind-mounted at /repo — pnpm install + tsx
#                watch run at container start against your live source.
#   - `runtime`: self-contained deploy image with the built dist/ baked in.
#
# All targets build successfully as of this writing (`openmvs-builder`,
# `toolchain`, `dev`, `builder`, `runtime`), and `dev` has been exercised
# end to end via docker-compose's `backend` service, running colmap +
# OpenMVS through the actual reconstruction pipeline code against a test
# video. Not yet verified: a full reconstruction succeeding against real
# multi-view footage (only tried a synthetic single-viewpoint test clip,
# which correctly fails at the colmap mapper stage — no 3D structure to
# triangulate) — and the `runtime` image hasn't been run, only built.

##
## ---- openmvs builder ------------------------------------------------------
## Builds OpenMVS from source per https://github.com/cdcseacave/openMVS/wiki/Building.
## Same base distro as `toolchain` below so the shared libraries OpenMVS
## links against here match the versions installed there.
##
FROM ubuntu:22.04 AS openmvs-builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    ca-certificates \
    python3-dev \
    libboost-all-dev \
    libgmp-dev \
    libmpfr-dev \
    libeigen3-dev \
    libopencv-dev \
    libceres-dev \
    libgflags-dev \
    libgoogle-glog-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Ubuntu 22.04's apt nanoflann (1.4.2) predates the nanoflann::SearchParameters
# rename OpenMVS calls — build a current release from source (header-only).
RUN git clone --depth 1 --branch v1.9.0 https://github.com/jlblancoc/nanoflann.git \
  && cmake -S nanoflann -B nanoflann/build -DCMAKE_BUILD_TYPE=Release \
  && cmake --build nanoflann/build -j"$(nproc)" \
  && cmake --install nanoflann/build

# Ubuntu 22.04's apt CGAL (5.4) predates CGAL/AABB_traits_3.h (the AABB tree
# API OpenMVS's SceneReconstruct.cpp uses was generalized/renamed in CGAL
# 6.x) — install a current release from source. Header-only: this is a
# `cmake --install` of headers + config, not a real compile.
RUN git clone --depth 1 --branch v6.2 https://github.com/CGAL/cgal.git \
  && cmake -S cgal -B cgal/build \
  && cmake --install cgal/build

RUN git clone --depth 1 https://github.com/cdcseacave/VCG.git vcglib
# Pinned to a tagged release rather than the default branch: master pulls in
# a newer SFM module (PoseLib/TinyEXIF/TinyNPY, cmake>=3.24) with no apt
# packages available for several of its dependencies on Ubuntu 22.04.
RUN git clone --recursive --depth 1 --branch v2.4.0 https://github.com/cdcseacave/openMVS.git openMVS

# Ubuntu 22.04's apt OpenCV (4.5.4) predates IMWRITE_JPEGXL_QUALITY (added in
# OpenCV 4.9) — drop the .jxl save path, which this pipeline never exercises
# (textures come out as .png/.jpg).
RUN sed -i '/if (ext == "\.jxl")/,+3d' openMVS/libs/Common/Types.inl

# libjxl has no Ubuntu 22.04 apt package, and OpenMVS's own
# pkg_check_modules_fullpath_libs macro passes REQUIRED even though its only
# caller treats JPEG XL as optional (checks JPEGXL_FOUND afterward) — an
# upstream CMake bug. Dropping REQUIRED restores the intended optional check.
RUN sed -i 's/pkg_check_modules(\${PREFIX} REQUIRED IMPORTED_TARGET \${MODULE_NAME})/pkg_check_modules(${PREFIX} IMPORTED_TARGET ${MODULE_NAME})/' \
      openMVS/libs/IO/CMakeLists.txt

RUN mkdir openMVS_build && cd openMVS_build \
  && cmake ../openMVS \
       -DCMAKE_BUILD_TYPE=Release \
       -DVCG_ROOT=/build/vcglib \
       -DOpenMVS_USE_CUDA=OFF \
       -DOpenMVS_USE_PYTHON=OFF \
  && make -j"$(nproc)"

##
## ---- toolchain -------------------------------------------------------
## OS-level deps shared by every other stage below: Node + pnpm, colmap,
## ffmpeg, and the OpenMVS binaries built above. Kept on one base image so
## `dev`, `builder`, and `runtime` all link/run against the same glibc —
## building JS-side native deps (sharp, esbuild) against a different distro
## than they run in is a common source of "works in one stage, segfaults in
## the other" bugs.
##
FROM ubuntu:22.04 AS toolchain

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    colmap \
    ffmpeg \
    libboost-all-dev \
    libgmp10 \
    libgmpxx4ldbl \
    libmpfr6 \
    libeigen3-dev \
    libopencv-dev \
    libceres-dev \
    libgflags-dev \
    libgoogle-glog-dev \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY --from=openmvs-builder /build/openMVS_build/bin/ /usr/local/lib/openmvs/
ENV OPENMVS_BIN_DIR=/usr/local/lib/openmvs

# The apt-packaged colmap binary is built with Qt GUI support and aborts on
# a headless host ("could not connect to display") unless told to use Qt's
# offscreen platform plugin instead of trying to open a real X display.
ENV QT_QPA_PLATFORM=offscreen

##
## ---- dev ---------------------------------------------------------------
## `docker-compose.yml`'s `backend` service targets this and bind-mounts the
## repo at /repo — no source is baked into the image, so pnpm install + tsx
## watch run fresh (well, pnpm-cached) at every container start.
##
FROM toolchain AS dev

WORKDIR /repo
COPY packages/backend/docker/dev-entrypoint.sh /usr/local/bin/dev-entrypoint.sh
RUN chmod +x /usr/local/bin/dev-entrypoint.sh

CMD ["/usr/local/bin/dev-entrypoint.sh"]

##
## ---- builder -------------------------------------------------------------
## Builds the TypeScript backend and its shared workspace dependency for the
## `runtime` target below.
##
FROM toolchain AS builder

WORKDIR /repo
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/backend/package.json packages/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile --filter @jrposada/fit-log-backend...

COPY packages/shared packages/shared
COPY packages/backend packages/backend

RUN pnpm --filter @jrposada/fit-log-shared build
RUN pnpm --filter @jrposada/fit-log-backend build

##
## ---- runtime -----------------------------------------------------------
## Self-contained deploy image — the built dist/ + node_modules baked in,
## no bind mount required.
##
FROM toolchain AS runtime

WORKDIR /repo
COPY --from=builder /repo /repo

WORKDIR /repo/packages/backend
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
