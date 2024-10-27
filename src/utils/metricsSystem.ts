export class DistanceConverter {
    convertToMiles(kilometers: number) {
        return kilometers * 0.621371;
    }
}

const converter = new DistanceConverter();
const kilometers = 20;
const miles = converter.convertToMiles(kilometers);
console.log(`${kilometers} kilometers is equal to ${miles} miles.`)