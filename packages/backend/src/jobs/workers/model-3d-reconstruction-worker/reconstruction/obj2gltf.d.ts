declare module 'obj2gltf' {
  interface Obj2GltfOptions {
    binary?: boolean;
    [key: string]: unknown;
  }

  type Obj2Gltf = (
    objPath: string,
    options?: Obj2GltfOptions
  ) => Promise<Buffer | Record<string, unknown>>;

  const obj2gltf: Obj2Gltf;
  export default obj2gltf;
}
