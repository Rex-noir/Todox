import { useScroll } from "@use-gesture/react";
import { forwardRef, useRef } from "react";

const emptyFunction = (): void => {
  return;
};

type DocumentPropsType = React.HTMLProps<HTMLElement>;

export const outerElementType = forwardRef<HTMLElement, DocumentPropsType>(
  ({ onScroll, children }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useScroll(
      () => {
        if (!(onScroll instanceof Function)) {
          return;
        }

        const {
          clientWidth,
          clientHeight,
          scrollLeft,
          scrollTop,
          scrollHeight,
          scrollWidth,
        } = document.documentElement;

        if (onScroll != null) {
          onScroll({
            currentTarget: {
              clientHeight,
              clientWidth,
              scrollLeft,
              addEventListener: emptyFunction,
              removeEventListener: emptyFunction,
              dispatchEvent: () => false,
              scrollTop:
                scrollTop -
                (containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + scrollTop
                  : 0),
              scrollHeight,
              scrollWidth,
            },
          } as unknown as React.UIEvent<HTMLElement>);
        }
      },
      { target: window },
    );

    if (forwardedRef != null && !(forwardedRef instanceof Function)) {
      forwardedRef.current = document.documentElement;
    }

    return (
      <div
        ref={containerRef}
        className="w-full"
        style={{ position: "relative" }}
      >
        {children}
      </div>
    );
  },
);
