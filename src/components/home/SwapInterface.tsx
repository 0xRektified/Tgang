import React, { useState } from "react";
import styled from "styled-components";
import { Pool } from "../../hooks/useFetchPools";
import { SwapRequest, useSwapPool } from "../../hooks/useSwapPool";
import { IUserInfo } from "../interfaces/user.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { ApiToast } from "../ApiToast";
import { centsToDollars, dollarsToCents, formatCentsAsNumber, parseInputToCents } from "../../utils/currency";

const SwapContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const SwapTitle = styled.h3`
  color: #fff;
  text-align: center;
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const SwapForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CompactRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const PoolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
`;

const PoolCard = styled.button<{ isSelected: boolean }>`
  background: ${({ isSelected }) => 
    isSelected ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${({ isSelected }) => isSelected ? '#2196F3' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 12px 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    border-color: #2196F3;
  }
`;

const PoolIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const PoolName = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 2px;
`;

const PoolPrice = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ToggleContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2px;
  position: relative;
  width: 140px;
  height: 36px;
`;

const ToggleOption = styled.button<{ isActive: boolean; isBuy: boolean }>`
  flex: 1;
  background: ${({ isActive, isBuy }) => 
    isActive 
      ? (isBuy ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #FF6B6B, #ee5a52)')
      : 'transparent'
  };
  border: none;
  border-radius: 18px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  
  &:hover {
    background: ${({ isActive, isBuy }) => 
      isActive 
        ? (isBuy ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #FF6B6B, #ee5a52)')
        : 'rgba(255, 255, 255, 0.1)'
    };
  }
`;

const TokenButton = styled.button<{ isSelected: boolean; isUSD: boolean }>`
  background: ${({ isSelected, isUSD }) => 
    isSelected 
      ? (isUSD ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #2196F3, #1976D2)')
      : 'rgba(255, 255, 255, 0.1)'
  };
  border: 2px solid ${({ isSelected }) => isSelected ? '#fff' : 'transparent'};
  border-radius: 12px;
  padding: 12px 8px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 70px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const TokenIcon = styled.span`
  font-size: 1.5rem;
`;

const AmountInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const SwapArrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
`;

const ArrowButton = styled.button`
  background: linear-gradient(135deg, #FF6B6B, #ee5a52);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  
  &:hover {
    transform: rotate(180deg) scale(1.1);
  }
`;

const SwapButton = styled.button<{ disabled: boolean }>`
  background: ${({ disabled }) => 
    disabled 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'linear-gradient(135deg, #FF6B6B, #ee5a52)'
  };
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover {
    ${({ disabled }) => !disabled && `
      transform: translateY(-1px);
    `}
  }
`;

const BalanceInfo = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-top: 4px;
`;

const EstimateInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  text-align: center;
`;

interface SwapInterfaceProps {
  pools: Pool[];
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({
  pools,
  userInfo,
  setUserInfo,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [isBuying, setIsBuying] = useState<boolean>(true); // true = buy product with USD, false = sell product for USD
  const [amount, setAmount] = useState<string>("");

  const { swap, loading, error, successMessage } = useSwapPool();

  // Get available products safely
  const availableProducts = userInfo?.products?.map(p => p.name) || [];

  // Find current pool
  const getCurrentPool = (): Pool | null => {
    if (!selectedProduct || !pools.length) {
      console.log('getCurrentPool early return:', { selectedProduct, poolsLength: pools.length });
      return null;
    }
    const pairId = `USD-${selectedProduct.toUpperCase()}`;
    console.log('Looking for pool:', { 
      pairId, 
      availablePools: pools.map(p => ({ id: p?.id, cash: p?.cash?.name, product: p?.product?.name })),
      selectedProduct 
    });
    const foundPool = pools.find(pool => pool?.id === pairId) || null;
    console.log('Found pool:', foundPool ? { id: foundPool.id, cash: foundPool.cash?.name, product: foundPool.product?.name } : null);
    return foundPool;
  };

  // Calculate estimated output (returns in display units: dollars for USD, units for products)
  const getEstimatedOutput = (): number => {
    const currentPool = getCurrentPool();
    if (!currentPool || !amount || isNaN(Number(amount))) {
      return 0;
    }

    const amountNum = Number(amount);
    if (amountNum <= 0) return 0;

    try {
      const feePercent = currentPool.feePercent || 0;
      const feeMultiplier = 1 - (feePercent / 100);
      
      let reserveIn: number = 0, reserveOut: number = 0, amountInForCalculation: number = 0;
      
      if (isBuying) {
        // Buying product with USD: convert user input dollars to cents for calculation
        amountInForCalculation = dollarsToCents(amountNum) * feeMultiplier;
        reserveIn = currentPool.cash?.reserve || 0; // USD in cents
        reserveOut = currentPool.product?.reserve || 0; // Product units
      } else {
        // Selling product for USD: input is already in product units
        amountInForCalculation = amountNum * feeMultiplier;
        reserveIn = currentPool.product?.reserve || 0; // Product units
        reserveOut = currentPool.cash?.reserve || 0; // USD in cents
      }

      if (reserveIn <= 0 || reserveOut <= 0) return 0;

      const estimatedAmountRaw = (amountInForCalculation * reserveOut) / (reserveIn + amountInForCalculation);
      
      if (isBuying) {
        // Output is product units (already in correct format)
        return Math.max(0, estimatedAmountRaw);
      } else {
        // Output is USD in cents, convert to dollars for display
        return Math.max(0, centsToDollars(estimatedAmountRaw).toNumber());
      }
    } catch (error) {
      console.error('Error calculating estimated output:', error);
      return 0;
    }
  };

  const handleToggleBuySell = () => {
    setIsBuying(!isBuying);
    setAmount("");
  };

  const handleSwap = async () => {
    if (!selectedProduct || !amount) {
      console.log('Swap blocked:', { selectedProduct, amount: !!amount });
      return;
    }

    const estimatedOut = getEstimatedOutput();
    if (estimatedOut <= 0) {
      console.log('Swap blocked: estimatedOut =', estimatedOut);
      return;
    }

    // Convert amounts to cents when dealing with USD
    let amountInCents: number;
    let minAmountOutCents: number;
    
    if (isBuying) {
      // Buying product with USD: convert USD input to cents
      amountInCents = dollarsToCents(Number(amount));
      minAmountOutCents = Math.floor(estimatedOut * 0.95); // Product units (already integers)
    } else {
      // Selling product for USD: input is product units, output should be in cents
      amountInCents = Number(amount); // Product units (already integers)
      minAmountOutCents = dollarsToCents(estimatedOut * 0.95); // Convert USD output to cents
    }

    const swapRequest: SwapRequest = {
      tokenIn: isBuying ? "USD" : selectedProduct,
      tokenOut: isBuying ? selectedProduct : "USD",
      amountIn: amountInCents,
      minAmountOut: minAmountOutCents,
    };

    console.log('Swap request:', swapRequest);
    const result = await swap(swapRequest, setUserInfo);
    if (result) {
      setAmount("");
    }
  };

  const getUserBalance = (token: string): number => {
    if (token === "USD") {
      // cashAmount is in cents, convert to dollars for display
      const cashInCents = userInfo?.cashAmount || 0;
      return centsToDollars(cashInCents).toNumber();
    }
    const product = userInfo?.products?.find(p => p.name === token);
    return product?.quantity || 0;
  };

  const currentPool = getCurrentPool();
  const estimatedOut = getEstimatedOutput();
  
  const inputToken = isBuying ? "USD" : selectedProduct;
  const outputToken = isBuying ? selectedProduct : "USD";
  
  const inputBalance = getUserBalance(inputToken);
  const hasEnoughBalance = !amount || Number(amount) <= inputBalance;
  
  const isSwapDisabled = !selectedProduct || !amount || loading || estimatedOut <= 0 || !hasEnoughBalance;
  
  // Debug the disabled state
  console.log('Button state check:', {
    selectedProduct: !!selectedProduct,
    amount: !!amount,
    loading,
    currentPool: !!currentPool,
    estimatedOut,
    isSwapDisabled,
    isBuying,
    inputBalance,
    hasEnoughBalance,
    inputToken,
    outputToken,
    amountNumber: Number(amount)
  });

  // Helper function to get pool price (USD per product unit)
  const getPoolPrice = (pool: Pool): number => {
    if (!pool.cash?.reserve || !pool.product?.reserve) return 0;
    // pool.cash.reserve is in cents, convert to dollars for display
    const dollarsReserve = centsToDollars(pool.cash.reserve).toNumber();
    return dollarsReserve / pool.product.reserve;
  };

  return (
    <SwapContainer>
      <SwapTitle>💱 Exchange</SwapTitle>
      
      <SwapForm>
        {/* Pools Preview */}
        <PoolsGrid>
          {pools.map((pool) => {
            const productName = pool.product?.name || "";
            const price = getPoolPrice(pool);
            const userBalance = getUserBalance(productName);
            return (
              <PoolCard
                key={pool.id}
                isSelected={selectedProduct === productName}
                onClick={() => setSelectedProduct(productName)}
              >
                <PoolIcon>{EProductIcon[productName as EProduct] || "🔶"}</PoolIcon>
                <PoolName>{productName}</PoolName>
                <PoolPrice>${price.toFixed(2)}</PoolPrice>
                {userBalance > 0 && (
                  <div style={{ fontSize: '0.6rem', color: '#4CAF50' }}>
                    Own: {userBalance}
                  </div>
                )}
              </PoolCard>
            );
          })}
        </PoolsGrid>

        {selectedProduct && (
          <CompactRow>
            <ToggleContainer>
              <ToggleOption 
                isActive={isBuying} 
                isBuy={true}
                onClick={() => setIsBuying(true)}
              >
                💰 BUY
              </ToggleOption>
              <ToggleOption 
                isActive={!isBuying} 
                isBuy={false}
                onClick={() => setIsBuying(false)}
              >
                💸 SELL
              </ToggleOption>
            </ToggleContainer>
          </CompactRow>
        )}

        {selectedProduct && (
          <>
            {/* Amount Input */}
            <div>
              <AmountInput
                type="number"
                placeholder={`${inputToken} amount`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <BalanceInfo>
                Available: {getUserBalance(inputToken).toLocaleString()} {inputToken}
              </BalanceInfo>
            </div>

            {/* Estimate Info */}
            {currentPool && estimatedOut > 0 && amount && (
              <EstimateInfo>
                ≈ {estimatedOut.toFixed(2)} {outputToken} • Fee: {currentPool.feePercent || 0}%
              </EstimateInfo>
            )}

            {/* Swap Button */}
            <SwapButton
              disabled={false}
              onClick={() => {
                console.log('Swap button clicked!', { isBuying, selectedProduct, amount, isSwapDisabled });
                handleSwap();
              }}
            >
              {loading ? "Processing..." : `${isBuying ? "Buy" : "Sell"} ${selectedProduct}`}
            </SwapButton>
          </>
        )}
      </SwapForm>

      <ApiToast
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </SwapContainer>
  );
};