import userCharacter from "/assets/user_no_background.png";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBoxRow, FlexBoxCol } from "../styled/globalStyled";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { Product } from "../interfaces/user.interface";
import { FaArrowRightLong } from "react-icons/fa6";
import { Transaction } from "./utils/types";
import { HomeBoard } from "./HomeBoard";

const NeonText = styled.div`
  font-size: 1.5rem;
  color: #fff;
  text-align: right;
  font-weight: bold;
  text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700,
    0 0 20px #ffd700, 0 0 25px #ffd700, 0 0 30px #ffd700, 0 0 35px #ffd700;
  animation: glow 1.5s infinite alternate, pulse 2s infinite;
  position: absolute;
  top: 0px;
  left: 90px;
  z-index: 1;

  @keyframes glow {
    from {
      text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700,
        0 0 20px #ffd700, 0 0 25px #ffd700, 0 0 30px #ffd700, 0 0 35px #ffd700;
    }
    to {
      text-shadow: 0 0 10px #ffdf00, 0 0 20px #ffdf00, 0 0 30px #ffdf00,
        0 0 40px #ffdf00, 0 0 50px #ffdf00, 0 0 60px #ffdf00, 0 0 70px #ffdf00;
    }
  }
`;

const ClickableArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 100%;
  transition: transform 0.15s ease-in-out;
  &.pressed {
    transform: scale(1.15);
  }
`;

const HomeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  margin-top: 25px;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.8);
  flex-grow: 0;
  flex-shrink: 0;
  align-self: flex-start; /* Ensure it aligns with ProductsList */
  position: absolute;
  bottom: 0; /* Ensure it's positioned at the bottom */
  right: 0;
  z-index: 1; /* Adjust z-index if necessary */
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  margin-top: 25px;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.8);
  width: 25%;
  flex-grow: 0;
  flex-shrink: 0;
  align-self: flex-start;
  position: absolute;
  bottom: 100; /* Align at the bottom */
  right: 0;
  z-index: 2; /* Ensure it's above HomeBoardContainer */
`;

const ProductRow = styled(FlexBoxRow)<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem;
  margin-bottom: 0.3rem;
  transition: transform 0.2s;
  border: ${(props) =>
    props.isSelected ? "2px solid  #ffd70012" : "2px solid #595757"};
  border-radius: 5px;
  background-color: ${(props) =>
    props.isSelected ? " #ffd7001a" : "##59575742"};
  width: 100%; // Ensure the ProductRow takes full width

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
  flex-grow: 1;
`;

const Smoke = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: url("/assets/smoke.png") no-repeat;
  background-size: contain;
  bottom: 0;
  opacity: 0.5;
  animation: moveSmoke linear infinite;

  @keyframes moveSmoke {
    0% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(100vw) scale(2);
      opacity: 0;
    }
  }
`;

const ButtonFlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0px;
`;

const CenteredIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1em;
`;

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 6px;
  box-shadow: 0 0 1px #eab308, 0 0 5px #eab308, 0 0 8px #eab308,
    0 0 10px #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  margin: 1em;
  padding: 0.8em;
  flex: 1;
`;

const ShipButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 6px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
interface ClickableAreaWithSmokeProps {
  products: Product[];
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  pressed: boolean;
  selectedProduct: string;
  setSelectedProduct: Dispatch<SetStateAction<string>>;
  handleOpenSupplierModal: () => void;
  handleOpenShippingModal: () => void;
  customers: string[];
  transaction: Transaction | null;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
}

export const ClickableAreaWithSmoke: React.FC<ClickableAreaWithSmokeProps> = ({
  products,
  handleTouchStart,
  pressed,
  selectedProduct,
  setSelectedProduct,
  handleOpenSupplierModal,
  handleOpenShippingModal,
  customers,
  transaction,
  animatingEmojis,
}) => {
  const [smokes, setSmokes] = useState<JSX.Element[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
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
    <>
      <ClickableArea onTouchStart={handleTouchStart}>
        {smokes}
        <FlexBoxRow className="w-full justify-center">
          <NeonText>TAP TO SELL</NeonText>
          <ImageContainer className={pressed ? "pressed" : ""}>
            <img
              src={userCharacter}
              alt="Logo"
              style={{ maxWidth: "250px", paddingTop: "50px" }}
              className={imageLoaded ? "animate-fade-in" : ""}
              onLoad={handleImageLoad}
            />
          </ImageContainer>
        </FlexBoxRow>

        <HomeBoardContainer>
          <HomeBoard
            customers={customers}
            transaction={transaction}
            animatingEmojis={animatingEmojis}
          />
        </HomeBoardContainer>
      </ClickableArea>

      <ProductsList>
        <CenteredIconContainer>
          <NeonButton onClick={handleOpenSupplierModal} className="skeleton">
            Market
          </NeonButton>
        </CenteredIconContainer>
        {Object.values(EProduct).map((productName, index) => {
          const product = products.find((p) => p.name === productName);
          const quantity = product ? product.quantity : 0;
          return (
            <FlexBoxRow key={productName} style={{ alignItems: "center" }}>
              <ProductRow
                isSelected={selectedProduct === productName}
                onClick={() => setSelectedProduct(productName)}
              >
                {selectedProduct === productName && (
                  <FaArrowRightLong className="h-6" />
                )}
                <ProductNameD>
                  {EProductIcon[productName as keyof typeof EProductIcon]}{" "}
                  {quantity}
                </ProductNameD>
              </ProductRow>
            </FlexBoxRow>
          );
        })}
      </ProductsList>
    </>
  );
};
