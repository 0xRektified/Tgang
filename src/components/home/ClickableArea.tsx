import userCharacter from "/assets/home/user_no_background.png";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { Product } from "../interfaces/user.interface";
import { MdArrowCircleRight } from "react-icons/md";
import { Transaction } from "./utils/types";
import { HomeBoard } from "./HomeBoard";
import { IMarketInfo } from "../interfaces/market.interface";
import { FaStore } from "react-icons/fa";
import { useTutorial } from "../../hooks/useTutorial";
import { SkipButton } from "./Home";

const Arrow = styled(({ isSelected, ...rest }) => (
  <MdArrowCircleRight {...rest} />
))<{ isSelected: boolean }>`
  position: absolute;
  left: -1.5rem;
  font-size: 1.5rem;
  color: ${(props) => (props.isSelected ? "#ffd700" : "transparent")};
  transition: color 0.2s;
`;

const ProductRow = styled(FlexBoxRow)<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem;
  margin-bottom: 0.3rem;
  transition: transform 0.2s;
  border: ${(props) =>
    props.isSelected ? "2px solid #ffd70012" : "2px solid #595757"};
  border-radius: 5px;
  background-color: ${(props) =>
    props.isSelected ? "#ffd7001a" : "#59575742"};
  width: 100%;

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

const NeonText = styled.div`
  font-size: 1.5rem;
  color: #fff;
  text-align: right;
  font-weight: bold;
  text-shadow: 0 0 5px #74b9ff, 0 0 10px #74b9ff, 0 0 15px #74b9ff,
    0 0 20px #74b9ff, 0 0 25px #74b9ff, 0 0 30px #74b9ff, 0 0 35px #74b9ff;
  animation: glow 1.5s infinite alternate, pulse 2s infinite;
  position: absolute;
  top: 0px;
  left: 90px;
  z-index: 1;
  box-shadow: none !important;
  @keyframes glow {
    from {
      text-shadow: 0 0 5px #74b9ff, 0 0 10px #74b9ff, 0 0 15px #74b9ff,
        0 0 20px #74b9ff, 0 0 25px #74b9ff, 0 0 30px #74b9ff, 0 0 35px #74b9ff;
    }
    to {
      text-shadow: 0 0 10px #74b9ff, 0 0 20px #74b9ff, 0 0 30px #74b9ff,
        0 0 40px #74b9ff, 0 0 50px #74b9ff, 0 0 60px #74b9ff, 0 0 70px #74b9ff;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ClickableArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  overflow: hidden;
`;

const ClickableAreaTutorial = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 30%;
  height: 80%;
  position: relative;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  z-index: 1;
  margin-top: 1em;
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
  background: url("/assets/home/smoke.png") no-repeat;
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

const CenteredIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1em;
`;

const EnhancedNeonButton = styled.button`
  background: linear-gradient(45deg, #2c3e50, #4a69bd);
  color: white;
  border: 2px solid #74b9ff;
  padding: 0.6em 1em;
  font-size: 0.9em;
  text-shadow: 0 0 5px #74b9ff;
  transition: all 0.3s ease;
  max-width: 90%;
  margin: 0 auto;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(116, 185, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0);
    }
  }

  animation: pulse 2s infinite;

  &:hover {
    background: linear-gradient(45deg, #4a69bd, #2c3e50);
    box-shadow: 0 0 10px #74b9ff, 0 0 20px #74b9ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em 0.8em;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.7em;
    padding: 0.5em 0.8em;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.6em;
  }
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
  margin: 0.5em;
  padding: 0.9em;
  flex: 1;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
`;

const IconWrapper = styled.div`
  font-size: 1.5em;
  margin-bottom: 0.3em;
`;

const ButtonText = styled.span`
  margin-left: 0.5em;
  @media (max-width: 360px) {
    display: none;
  }
`;

export const FlexBoxRowPriceNeon = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3em;
  align-items: center;
`;
const NeonGoldText = styled.span`
  color: #ffd700;
  text-shadow: 0 0 2px #ffd700,  0 0 6px #ffd700,
    0 0 8px #ffd700, 
  font-weight: bold;
  font-size: 0.6rem;
`;

const NeonGreenText = styled.span`
  color: #32cd32;
  text-shadow: 0 0 2px #32cd32,  0 0 6px #32cd32,
    0 0 8px #32cd32, 
  font-weight: bold;
  font-size: 0.6rem;

`;

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TutorialText = styled.div`
  position: absolute;
  top: 5em;
  left: 0;
  right: 0;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  z-index: 1001;
`;

const TutorialTextTwo = styled.div`
  position: absolute;
  top: 10em;
  left: 0;
  right: 0;
  color: white;
  font-size: 1.3rem;
  z-index: 1001;
`;

const SkipButtonWrapper = styled.div`
  position: absolute;
  bottom: 5em;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const GlowingImage = styled.img`
  max-width: 15rem;
  padding-top: 7rem;
  filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.7));
  transition: all 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 20px rgba(0, 123, 255, 0.9));
    transform: scale(1.05);
  }
`;

interface ClickableAreaWithSmokeProps {
  products: Product[];
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => boolean;
  selectedProduct: string;
  setSelectedProduct: Dispatch<SetStateAction<string>>;
  handleOpenSupplierModal: () => void;
  customer: string;
  customerAmount: number;
  transaction: Transaction | null;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
  marketInfo: IMarketInfo | undefined;
  signup: boolean;
  tutorial: ReturnType<typeof useTutorial>;
}

export const ClickableAreaWithSmoke: React.FC<ClickableAreaWithSmokeProps> = ({
  products,
  handleTouchStart,
  selectedProduct,
  setSelectedProduct,
  handleOpenSupplierModal,
  customer,
  customerAmount,
  transaction,
  animatingEmojis,
  marketInfo,
  signup,
  tutorial,
}) => {
  const [smokes, setSmokes] = useState<JSX.Element[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pressed, setPressed] = useState(false);

  const animationTargetRef = useRef<HTMLDivElement>(null);
  const handleAnimation = (e: React.TouchEvent<HTMLDivElement>) => {
    const result = handleTouchStart(e);

    if (result) {
      if (!pressed) {
        setPressed(true);

        const element = animationTargetRef.current;
        if (element) {
          element.style.animation = "none";
          void element.offsetWidth;
          element.style.animation = `scaleUpDown 0.1s ease-in-out`;
        }

        requestAnimationFrame(() => {
          setTimeout(() => {
            setPressed(false);
          }, 10);
        });
      }
    }
  };

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleCombinedOnLoad = useCallback(() => {
    handleImageLoad();
  }, [handleImageLoad]);

  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    preloadImage(userCharacter);
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
          />,
        );
      }
      return newSmokes;
    };

    setSmokes(createSmoke());
  }, []);

  const handleCombinedClick = (e: React.TouchEvent<HTMLDivElement>) => {
    tutorial.handleTutorialClick();
    handleAnimation(e);
  };

  const handleTutorialTwoClick = useCallback(() => {
    if (signup && !tutorial.tutorialCompleted && tutorial.tutorialStep === 1) {
      tutorial.onTutorialProgress();
    }
    handleOpenSupplierModal();
  }, [signup, tutorial, handleOpenSupplierModal]);

  useEffect(() => {
    if (signup && !tutorial.tutorialCompleted && tutorial.tutorialStep === 1) {
    }
  }, [signup, tutorial.tutorialCompleted, tutorial.tutorialStep]);

  const handleSkipTutorial = () => {
    tutorial.setTutorialCompleted(true);
    tutorial.tutorialCompleted = true;
  };

  return (
    <Wrapper>
      <ClickableArea onTouchStart={handleCombinedClick}>
        {(!signup ||
          tutorial.tutorialCompleted ||
          tutorial.tutorialStep !== 0) && (
          <FlexBoxRow className="w-full justify-center">
            <NeonText>TAP TO SELL</NeonText>

            <div
              ref={animationTargetRef}
              className={`flex flex-col items-center justify-left w-full ${
                pressed ? "animate-scale-up-down" : ""
              }`}
              style={{ height: "100%" }}
            >
              <GlowingImage
                src={userCharacter}
                alt="Logo"
                {...({
                  fetchpriority: "high",
                } as React.ImgHTMLAttributes<HTMLImageElement>)}
                className={`max-w-[15rem] pt-28 `}
                onLoad={handleCombinedOnLoad}
              />
            </div>
          </FlexBoxRow>
        )}
      </ClickableArea>

      <Container>
        <ProductsList>
          <CenteredIconContainer>
            <EnhancedNeonButton
              onClick={handleOpenSupplierModal}
              className="skeleton"
            >
              <ButtonContent>
                <IconWrapper>
                  <FaStore />
                </IconWrapper>
                <div>Trade</div>
                <div>Market</div>
              </ButtonContent>
            </EnhancedNeonButton>
          </CenteredIconContainer>
          {Object.values(EProduct).map((productName, index) => {
            const product = products.find((p) => p.name === productName);
            let productMarketprice = 0;
            let productMarketDiscountedPrice = 0;
            if (marketInfo && marketInfo.products.length > 0) {
              const productMarket = marketInfo.products.find(
                (m) => m.name === productName,
              );
              productMarketprice = productMarket?.price || 0;
              productMarketDiscountedPrice = productMarket?.discountPrice || 0;
            }
            const quantity = product ? product.quantity : 0;
            return (
              <FlexBoxRow key={productName} style={{ alignItems: "center" }}>
                <ProductRow
                  isSelected={selectedProduct === productName}
                  onClick={() => setSelectedProduct(productName)}
                >
                  <Arrow isSelected={selectedProduct === productName} />
                  <ProductNameD>
                    <FlexBoxRowPriceNeon className="w-full justify-center gap-1px">
                      <NeonGoldText>
                        ${productMarketDiscountedPrice.toFixed(2)}
                      </NeonGoldText>
                      <NeonGreenText>
                        /${productMarketprice.toFixed(2)}
                      </NeonGreenText>
                    </FlexBoxRowPriceNeon>
                    <FlexBoxRow className="w-full justify-center">
                      {EProductIcon[productName as keyof typeof EProductIcon]}
                      {quantity}
                    </FlexBoxRow>
                  </ProductNameD>
                </ProductRow>
              </FlexBoxRow>
            );
          })}
        </ProductsList>
        <HomeBoard
          customer={customer}
          customerAmount={customerAmount}
          transaction={transaction}
          animatingEmojis={animatingEmojis}
        />
      </Container>

      {signup && !tutorial.tutorialCompleted && (
        <TutorialOverlay>
          {tutorial.tutorialStep === 0 ? (
            <div>
              <TutorialText>
                Tap on the Player 10 times to sell your product! (
                {tutorial.clickCount}/10)
              </TutorialText>
              <SkipButton onClick={handleSkipTutorial}>
                Skip Tutorial
              </SkipButton>
              <ClickableAreaTutorial onTouchStart={handleCombinedClick}>
                <FlexBoxRow className="w-full justify-center">
                  <div
                    ref={animationTargetRef}
                    className={`flex flex-col items-center justify-left w-full ${
                      pressed ? "animate-scale-up-down" : ""
                    }`}
                    style={{ height: "100%" }}
                  >
                    <GlowingImage
                      src={userCharacter}
                      alt="Logo"
                      className={`max-w-[15rem] pt-28 `}
                    />
                  </div>
                </FlexBoxRow>
              </ClickableAreaTutorial>
            </div>
          ) : tutorial.tutorialStep === 1 ? (
            <div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                  zIndex: 1001,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "7.4em",
                    right: "0.8em",
                    width: "30%",
                  }}
                >
                  <CenteredIconContainer>
                    <EnhancedNeonButton
                      onClick={handleTutorialTwoClick}
                      className="skeleton"
                      style={{ pointerEvents: "auto" }}
                    >
                      <ButtonContent>
                        <IconWrapper>
                          <FaStore />
                        </IconWrapper>
                        <div>Trade</div>
                        <div>Market</div>
                      </ButtonContent>
                    </EnhancedNeonButton>
                  </CenteredIconContainer>
                </div>
              </div>

              <TutorialTextTwo>
                Great! Now let's buy more merchandise.
                <br />
                Tap the TRADE MARKET button to access the market.
              </TutorialTextTwo>
              <SkipButtonWrapper>
                <SkipButton onClick={handleSkipTutorial}>
                  Skip Tutorial
                </SkipButton>
              </SkipButtonWrapper>
            </div>
          ) : null}
        </TutorialOverlay>
      )}
    </Wrapper>
  );
};
