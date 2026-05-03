

export interface RegisterSellerDTO {
  user: {
    password: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    imageUrl: string;
  };
  quincaillerie: {
    storeName: string;
    region: string;
    ville: string;
    quartier: string;
    precision: String;
    photoUrl: string;
    description: string;
    latitude: number;
    longitude: number;
    nui: string;
    acceptsTerms: boolean;
    wantTips: boolean;
  };
}