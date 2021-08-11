export class UtilClass {

    static emptyIfUndefined(element) {
        if(element === undefined) {
            return ''
        } else {
            return element
        }
    }
}
