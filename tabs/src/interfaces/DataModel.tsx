export interface Feed {
    From: String;
    FromIcon: string;
    To: String;
    ToIcon: String;
    Reason: String;
    ZapAmount: number;
    Date: Date
}

export interface Leaderboard {
    Rank: number;
    User: string;
    ZapAmount: number
}

export interface ZapSent {
    TotalZapSent: number;
    AveragePerUser: number;
    AveragePerDay: number;
    BiggestZap: number;
    ZapsFromCopilots: number;
    ZapsToCopilots: number;
}