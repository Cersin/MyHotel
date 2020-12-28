export class Room {
    id: string;
    ilosc_miejsc: number;
    numer_pokoju: number;
    stan: {
        klucze: boolean;
        nowa_posciel: boolean;
        odkazone: boolean;
        posprzatane: boolean;
        uzupelniona_lodowka: boolean;

    }
    wyposazenie: {
        jacuzzi: boolean;
        minibar: boolean;
        tv: boolean;
        klimatyzacja: boolean;
    }
}
