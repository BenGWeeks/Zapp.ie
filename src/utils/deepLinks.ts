
// Helper function to generate task module deep links
export function taskModuleLink(
    appId: string,
    // tslint:disable:no-inferrable-types
    title: string = "",
    height: string | number = "medium",
    width: string | number = "medium",
    url: string = '',
    card: any = null,
    fallbackUrl?: string,
    completionBotId?: string): string {
        if ((url === null) && (card === null)) {
            return("Error generating deep link: you must specify either a card or URL.");
        }
        else {
            let cardOrUrl = (card === null) ? `url=${url}` : `card=${JSON.stringify(card)}`;
            let fallBack = (fallbackUrl === undefined) ? "" : `&fallbackUrl=${fallbackUrl}`;
            let completionBot = (completionBotId === undefined) ? "" : `&completionBotId=${completionBotId}`;
            return(encodeURI(`https://teams.microsoft.com/l/task/${appId}?${cardOrUrl}&height=${height}&width=${width}&title=${title}${fallBack}${completionBot}`));
        }
}