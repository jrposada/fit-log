import { Box, Snackbar as MuiSnackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { FunctionComponent, RefCallback, useEffect, useState } from 'react';
import SnackbarContent from './styled/snackbar-content';

type SnackbarProps = Omit<CustomContentProps, 'children'> & {
  ref?: HTMLDivElement;
};

const Snackbar: FunctionComponent<SnackbarProps> = ({
  action,
  autoHideDuration,
  id,
  ref,
  ...props
}) => {
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   console.log('setRef?');
  //   if (!ref) {
  //     return;
  //   }

  //   console.log('setRef', ref);
  //   const { width, height } = ref.getBoundingClientRect();
  //   setBoxSize({ width, height });
  // }, [ref]);

  const setRef: RefCallback<HTMLElement> = (boxRef) => {
    console.log('setRef?');
    if (!boxRef) {
      return;
    }

    console.log('setRef');
    const { width, height } = boxRef.getBoundingClientRect();
    setBoxSize({ width, height });
  };

  const progress = 0.5;

  const { width, height } = boxSize;
  const perimeter = 2 * (width + height);
  const dashOffset = perimeter * (1 - progress);

  return (
    <SnackbarContent
      {...props}
      action={typeof action === 'function' ? action(id) : action}
      id={`${id}`}
      // @ts-expect-error Mui has not been updated to React 19 ref as prop
      ref={ref}
      variant="success"
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          padding: 2,
          margin: 4,
        }}
      >
        <Box
          ref={setRef}
          sx={{
            backgroundColor: 'white',
            zIndex: 1,
            position: 'relative',
          }}
        >
          {/* <MuiSnackbar /> */}
          To be or Not to be
        </Box>

        {/* Animated Border */}
        {width > 0 && height > 0 && (
          <svg
            width={width}
            height={height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="none"
              stroke="#1976d2"
              strokeWidth="2"
              strokeDasharray={perimeter}
              strokeDashoffset={dashOffset}
              style={{
                transition: `stroke-dashoffset ${autoHideDuration}s ease`,
              }}
            />
          </svg>
        )}
      </Box>
    </SnackbarContent>
  );
};

export default Snackbar;
export type { SnackbarProps };
