export class UtilClass {
    let
     static countTrue (array) {
        let trueCount = []
        let i
        for(i=0; i<array.length; i++) {
            if(array[i]=== true){
                trueCount.push(array[i])
            }
        }
        return trueCount
    }
}
