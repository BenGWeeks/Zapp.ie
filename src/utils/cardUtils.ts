import * as builder from "botbuilder";
import * as stjs from "stjs";
import * as adaptiveCard from "adaptivecards";

export function renderACAttachment(template: any, data: any): builder.Attachment {
    // ToDo:
    // 1. Optionally validate that the schema is valid (postponed as there are tool/schema issues)

    // Pre-process the template so that template placeholders don't show up for null data values
    // Regex: Find everything between {{}} and prepend "#? " to it
    template = JSON.parse(JSON.stringify(template).replace(/{{(.+?)}}/g, "{{#? $1}}"));

    // No error handling in the call to stjs functions - what you pass in may be garbage, but it always returns a value
    let ac = stjs.select(data)
        .transformWith(template)
        .root();
    return {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: ac,
    };
}

export function renderO365ConnectorAttachment(template: any, data: any): builder.Attachment {
    // Pre-process the template so that template placeholders don't show up for null data values
    // Regex: Find everything between {{}} and prepend "#? " to it
    template = JSON.parse(JSON.stringify(template).replace(/{{(.+?)}}/g, "{{#? $1}}"));

    // No error handling in the call to stjs functions - what you pass in may be garbage, but it always returns a value
    let card = stjs.select(data)
        .transformWith(template)
        .root();
    return {
            contentType: "application/vnd.microsoft.teams.card.o365connector",
            content: card,
    };
}

export function renderCard(template: any, data: any): any {
    // Pre-process the template so that template placeholders don't show up for null data values
    // Regex: Find everything between {{}} and prepend "#? " to it
    template = JSON.parse(JSON.stringify(template).replace(/{{(.+?)}}/g, "{{#? $1}}"));

    // No error handling in the call to stjs functions - what you pass in may be garbage, but it always returns a value
    let card = stjs.select(data)
        .transformWith(template)
        .root();
    return card;
}

// This function doesn't work as written (the async logic and error handling aren't right)
// and should (perhaps) be refactored as a promise, but at least it captures the logic for validation
// import * as request from "request";
// import * as Ajv from "ajv";
/* function validateSchema(json: any): boolean {
    request({
        url: "http://adaptivecards.io/schemas/adaptive-card.json",
        json: true,
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let ajv = new Ajv();
            ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
            return(ajv.validate(body, json));
            }
        },
    );
    return true;
} */