export interface PoolInfo {
  
 // programId: string;    // nije potrebno
  poolId: string;         
    
  
  mintA_address: string;
  mintB_address: string;


  tvl: number;
  feeRate: number;

  apr1d: number;
  apr1w: number;
  apr1m: number;

  volume1d: number;
  volume1w: number;
 // volume1m: number;  // nije potrebno

 

  volumeFee1d: number; // koliko para je generisano u fijevima
  volumeFee1w: number;
  volumeFee1m: number;

  priceMin1d: number;
  priceMax1d: number;   
  priceMin1w: number; 
  priceMax1w: number;   
  priceMin1m: number; 
  priceMax1m: number;

 // volumeQuote1d: number; // nije potrebno
 // volumeQuote1w: number; // nije potrebno
 // volumeQuote1m: number; // nije potrebno

  // poolType: string[];  // nije potrebno
}