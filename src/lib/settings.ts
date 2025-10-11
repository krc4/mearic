
export interface FeaturedCard {
    title: string;
    description: string;
    image: string;
    link: string;
}

export interface HomepageSettings {
    kuranMucizeleri: {
        card1: FeaturedCard;
        card2: FeaturedCard;
    };
    hadisMucizeleri: {
        card1: FeaturedCard;
        card2: FeaturedCard;
    };
    islamiBloglar: {
        card1: FeaturedCard;
        card2: FeaturedCard;
    };
    populerKonular: {
        mainCard: FeaturedCard;
        sideCard1: FeaturedCard;
        sideCard2: FeaturedCard;
    }
}
