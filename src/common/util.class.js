export class UtilClass {

    static emptyIfUndefined(element) {
        if(element === undefined) {
            return ''
        } else {
            return element
        }
    }

    static UppercaseFirst(string) {
        return `${string.charAt(0).toUpperCase() + string.slice(1)}`
    }
}
