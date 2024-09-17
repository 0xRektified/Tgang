import userCharacter from "/assets/home/user_no_background.png";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { keyframes, css } from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { Product } from "../interfaces/user.interface";
import { MdArrowDropDown } from "react-icons/md";
import { HomeBoard } from "./HomeBoard";
import { IMarketInfo } from "../interfaces/market.interface";
import marketIcon from "/assets/market.png";
import shipping from "/assets/shipping.png";
import { useTutorial } from "../../hooks/useTutorial";
import { SkipButton } from "./Home";

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1px);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;
  }
  100% {
    box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff, 0 0 20px #1e90ff;
  }
`;

const ProductPanel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 5px;
  animation: ${slideDown} 0.5s ease-out;
  border-radius: 0 0 12px 12px;
`;

// Individual product column
const ProductColumn = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: ${({ isSelected }) => (isSelected ? "#242627" : "#242627")};
  color: white;
  border: 2px solid ${({ isSelected }) => (isSelected ? "white" : "#374151")};
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? "0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff"
      : "none"};

  &:hover {
    transform: translateY(-2px);
  }
  min-width: 3em;
  ${({ isSelected }) =>
    isSelected &&
    css`
      animation: ${bounce} 1s infinite, ${glow} 1.5s infinite alternate;
    `}
`;

const ProductIcon = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  font-size: 0.8rem;
  color: #4adf81;
`;

const ProductQuantity = styled.div`
  font-size: 0.8rem;
  color: white;
`;

// Down arrow indicator for selected product
const SelectedIndicator = styled(MdArrowDropDown)`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: #1e90ff;
  filter: drop-shadow(0 0 5px rgba(30, 144, 255, 0.7));
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
  top: 2em;
  left: 3em;
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
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 2em;
  right: 10px;
  z-index: 2;
`;

const ClickableArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  justify-content: flex-end;
  align-items: center;
`;

const ClickableAreaTutorial = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  justify-content: flex-end;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 30%;
  height: 80%;
  position: relative;
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

export const FlexBoxRowPriceNeon = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3em;
  align-items: center;
`;

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
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
const TutorialText2 = styled.div`
  position: absolute;
  top: 7em;
  left: 0;
  right: 0;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  z-index: 1001;
`;

const TutorialTextContainer = styled.div`
  position: absolute;
  top: 16em;
  left: 8em;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: left;
  font-size: 1rem;
`;

const TutorialTextTwo = styled.div`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
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
  max-width: 12em;
  max-height: 50vh;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.7));
  transition: all 0.3s ease;
  margin-bottom: 0;
  &:hover {
    filter: drop-shadow(0 0 20px rgba(0, 123, 255, 0.9));
    transform: scale(1.05);
  }
`;

const BouncingGlowingImage = styled(GlowingImage)`
  animation: bounce 2s infinite;
  margin-top: 15em;
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7px);
    }
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3em;
  pointer-events: none;
  z-index: 10;
  transform: translateY(-50%);
`;

const IconButtonShop = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 11;
  pointer-events: auto;

  img {
    width: 4rem;
    transition: all 0.3s ease;
  }
`;

const IconButtonShipping = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 11;
  pointer-events: auto;
  img {
    width: 4rem;
    transition: all 0.3s ease;
  }
`;

const bounceShop = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
`;

const HighlightedShopContainer = styled.div`
  position: relative;
  z-index: 1001;
  pointer-events: auto;
  animation: ${bounceShop} 2s infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconText = styled.span`
  font-family: "Orbitron", sans-serif;
  color: #d4eaff;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #1e90ff;
  box-shadow: 0 0 10px #a7d4ff, 0 0 20px #1e90ff;
  text-shadow: 0 0 5px #a7d4ff, 0 0 10px #1e90ff;
  white-space: nowrap;
  margin-top: 0.5em;
`;

const TutorialShopIcon = styled.div`
  position: absolute;
  top: 14em;
  left: 2em;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TutorialIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1003;
  pointer-events: auto;

  img {
    width: 6rem; // Larger than the original
    transition: all 0.3s ease;
  }
`;

interface ClickableAreaWithSmokeProps {
  products: Product[];
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => boolean;
  selectedProduct: string;
  setSelectedProduct: Dispatch<SetStateAction<string>>;
  handleOpenTilkRoadModal: () => void;
  handleOpenTedexModal: () => void;
  customer: string;
  customerAmount: number;
  customerAmountMax: number;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
  marketInfo: IMarketInfo | undefined;
  signup: boolean;
  tutorial: ReturnType<typeof useTutorial>;
  style?: React.CSSProperties;
}

export const ClickableAreaWithSmoke = React.memo(
  ({
    products,
    handleTouchStart,
    selectedProduct,
    setSelectedProduct,
    handleOpenTilkRoadModal,
    handleOpenTedexModal,
    customer,
    customerAmount,
    customerAmountMax,
    animatingEmojis,
    marketInfo,
    signup,
    tutorial,
    style,
  }: ClickableAreaWithSmokeProps) => {
    const [smokes, setSmokes] = useState<JSX.Element[]>([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [pressed, setPressed] = useState(false);

    const animationTargetRef = useRef<HTMLDivElement>(null);
    const handleAnimation = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
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
              }, 100);
            });
          }
        }
      },
      [handleTouchStart, pressed],
    );

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
      if (
        signup &&
        !tutorial.tutorialCompleted &&
        tutorial.tutorialStep === 1
      ) {
        tutorial.tutorialStep = 2;
        tutorial.onTutorialProgress();
      }
      handleOpenTilkRoadModal();
    }, [signup, tutorial, handleOpenTilkRoadModal]);

    useEffect(() => {
      if (
        signup &&
        !tutorial.tutorialCompleted &&
        tutorial.tutorialStep === 1
      ) {
      }
    }, [signup, tutorial.tutorialCompleted, tutorial.tutorialStep]);

    const handleSkipTutorial = () => {
      tutorial.setTutorialCompleted(true);
      tutorial.tutorialCompleted = true;
    };

    return (
      <Wrapper style={style}>
        <ProductPanel>
          {Object.values(EProduct).map((productName) => {
            const product = products.find((p) => p.name === productName);
            let productMarketPrice = 0;
            if (marketInfo && marketInfo.products.length > 0) {
              const productMarket = marketInfo.products.find(
                (m) => m.name === productName,
              );
              productMarketPrice = productMarket?.price || 0;
            }
            const isSelected = selectedProduct === productName;

            return (
              <ProductColumn
                key={productName}
                isSelected={isSelected}
                onClick={() => setSelectedProduct(productName)}
              >
                <ProductQuantity>{product?.quantity || 0}</ProductQuantity>
                <ProductIcon>
                  {EProductIcon[productName as keyof typeof EProductIcon]}
                </ProductIcon>
                <ProductPrice>${productMarketPrice.toFixed(2)}</ProductPrice>
                {isSelected && <SelectedIndicator />}
              </ProductColumn>
            );
          })}
        </ProductPanel>
        <IconContainer>
          <HighlightedShopContainer>
            <IconButtonShop onClick={handleOpenTilkRoadModal}>
              <img src={marketIcon} alt="Tilk Road Market" />
            </IconButtonShop>
            <IconText>SHOP</IconText>
          </HighlightedShopContainer>
          <HighlightedShopContainer>
            <IconButtonShipping onClick={handleOpenTedexModal}>
              <img src={shipping} alt="Tedex Market" />
            </IconButtonShipping>
            <IconText>SHIPPING</IconText>
          </HighlightedShopContainer>
        </IconContainer>
        <ClickableArea onTouchStart={handleCombinedClick}>
          {(!signup ||
            tutorial.tutorialCompleted ||
            tutorial.tutorialStep !== 0) && (
            <FlexBoxRow className="w-full justify-center">
              <div
                ref={animationTargetRef}
                className={`flex flex-col items-center justify-end w-full h-full ${
                  pressed ? "animate-scale-up-down" : ""
                }`}
              >
                <GlowingImage
                  src={userCharacter}
                  alt="Logo"
                  {...({
                    fetchpriority: "high",
                  } as React.ImgHTMLAttributes<HTMLImageElement>)}
                  onLoad={handleCombinedOnLoad}
                />
              </div>
            </FlexBoxRow>
          )}
          <ProgressBarContainer>
            <HomeBoard
              customer={customer}
              customerAmount={customerAmount}
              customerAmountMax={customerAmountMax}
              animatingEmojis={animatingEmojis}
            />
          </ProgressBarContainer>
        </ClickableArea>

        {signup && !tutorial.tutorialCompleted && (
          <TutorialOverlay>
            {tutorial.tutorialStep === 0 ? (
              <div style={{ width: "100%" }}>
                <TutorialText>Tap on the Player 5 times</TutorialText>
                <TutorialText2>
                  To sell your product! ({tutorial.clickCount}/5)
                </TutorialText2>
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
                    >
                      <BouncingGlowingImage
                        src={userCharacter}
                        alt="Logo"
                        className="max-w-[15rem]pt-24"
                      />
                    </div>
                  </FlexBoxRow>
                </ClickableAreaTutorial>
              </div>
            ) : tutorial.tutorialStep === 1 ? (
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <TutorialTextContainer>
                  <TutorialTextTwo> 👈 CLICK THE SHOP ICON</TutorialTextTwo>
                  <TutorialTextTwo>TO BUY RESOURCES</TutorialTextTwo>
                </TutorialTextContainer>

                {/* Add the new tutorial-specific icon here */}
                <TutorialShopIcon>
                  <TutorialIconButton onClick={handleTutorialTwoClick}>
                    <img src={marketIcon} alt="Tilk Road Market" />
                  </TutorialIconButton>
                  <IconText>SHOP</IconText>
                </TutorialShopIcon>

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
  },
);
