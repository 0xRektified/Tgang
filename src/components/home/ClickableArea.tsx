import userCharacter from "/assets/user_no_background.png";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { Product } from "../interfaces/user.interface";

const ClickableArea = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 410px;
  flex: 0 0 75%;
  transition: transform 0.15s ease-in-out;
  &.pressed {
    transform: scale(0.95);
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  border-radius: 0.5rem;
  flex: 0 0 25%;
`;

const ProductRow = styled(FlexBoxRow)`
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem;
  margin-bottom: 0.3rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  &.disabled {
    background-color: #1a202c;
    cursor: not-allowed;

    &:hover {
      transform: none;
    }

    div {
      color: #718096;
    }
  }
`;

const ProductNameD = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
`;

const ProductQuantity = styled.div`
  font-size: 0.8rem;
  color: #2d3748;
`;

const Smoke = styled.div`
  position: absolute;
  width: 500px; /* Increased size */
  height: 500px; /* Increased size */
  background: url("/assets/smoke.png") no-repeat;
  background-size: contain;
  bottom: 0; /* Start from the bottom */
  opacity: 0.5; /* Reduced opacity */
  animation: moveSmoke linear infinite;

  @keyframes moveSmoke {
    0% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(100vw) scale(2); /* Move from left to right */
      opacity: 0;
    }
  }
`;

interface ClickableAreaWithSmokeProps {
  products: Product[];
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  pressed: boolean;
}

export const ClickableAreaWithSmoke: React.FC<ClickableAreaWithSmokeProps> = ({
  products,
  handleTouchStart,
  pressed,
}) => {
  const [smokes, setSmokes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createSmoke = () => {
      const newSmokes: JSX.Element[] = [];
      for (let i = 0; i < 12; i++) {
        newSmokes.push(
          <Smoke
            key={i}
            style={{
              left: Math.random() * -500,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        );
      }
      return newSmokes;
    };

    setSmokes(createSmoke());
  }, []);

  return (
    <ClickableArea onTouchStart={handleTouchStart}>
      {smokes}

      <ImageContainer className={pressed ? "pressed" : ""}>
        <img src={userCharacter} alt="Logo" style={{ maxWidth: "200px" }} />
      </ImageContainer>
      <ProductsList>
        {Object.values(EProduct).map((productName, index) => {
          const product = products.find((p) => p.name === productName);
          const quantity = product ? product.quantity : 0;
          return index % 2 === 0 ? (
            <FlexBoxRow key={productName}>
              <ProductRow>
                <ProductNameD>
                  {EProductIcon[productName as keyof typeof EProductIcon]} X{" "}
                  {quantity}
                </ProductNameD>
              </ProductRow>
              {Object.values(EProduct)[index + 1] && (
                <ProductRow>
                  <ProductNameD>
                    {
                      EProductIcon[
                        Object.values(EProduct)[
                          index + 1
                        ] as keyof typeof EProductIcon
                      ]
                    }{" "}
                    X{" "}
                    {products.find(
                      (p) => p.name === Object.values(EProduct)[index + 1]
                    )?.quantity || 0}
                  </ProductNameD>
                </ProductRow>
              )}
            </FlexBoxRow>
          ) : null;
        })}
      </ProductsList>
    </ClickableArea>
  );
};
