import {
  createContext,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type CardTilt = {
  rotateX: number;
  rotateY: number;
};

type CardContainerProps = {
  children: ReactNode;
  className?: string;
};

type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardItemProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  translateZ?: number | string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const CardTiltContext = createContext<CardTilt>({ rotateX: 0, rotateY: 0 });

function getTranslateZValue(translateZ: number | string) {
  return typeof translateZ === "number" ? `${translateZ}px` : translateZ;
}

export function CardContainer({ children, className = "" }: CardContainerProps) {
  const [tilt, setTilt] = useState<CardTilt>({ rotateX: 0, rotateY: 0 });

  return (
    <div
      className={`card-3d-container ${className}`}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 22; // 22deg rich interactive tilt
        const rotateX = (0.5 - y / rect.height) * 22;

        setTilt({ rotateX, rotateY });
      }}
      style={
        {
          "--card-rotate-x": `${tilt.rotateX.toFixed(3)}deg`,
          "--card-rotate-y": `${tilt.rotateY.toFixed(3)}deg`,
        } as CSSProperties
      }
    >
      <CardTiltContext.Provider value={tilt}>{children}</CardTiltContext.Provider>
    </div>
  );
}

export function CardBody({ children, className = "", style, ...props }: CardBodyProps) {
  const tilt = useContext(CardTiltContext);

  return (
    <div
      className={`card-3d-body ${className}`}
      style={{
        transform: `rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`,
        ...(style as CSSProperties),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardItem<T extends ElementType = "div">({
  as,
  children,
  className = "",
  style,
  translateZ = 0,
  ...props
}: CardItemProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={`card-3d-item ${className}`}
      style={
        {
          transform: `translateZ(${getTranslateZValue(translateZ)})`,
          ...(style as CSSProperties),
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Component>
  );
}
