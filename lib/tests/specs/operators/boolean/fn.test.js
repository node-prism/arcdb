import { testSuite, expect } from "manten";
import { nrml, testCollection } from "../../../common";
export default testSuite(async ({ describe }) => {
    describe("$fn", ({ test }) => {
        test("works", () => {
            const collection = testCollection();
            collection.insert([
                { a: 2 },
                { a: 4 },
                { a: 5 },
                { a: 6 },
            ]);
            const isEven = (x) => x % 2 === 0;
            const found = nrml(collection.find({ a: { $fn: isEven } }));
            expect(found).toEqual([{ a: 2 }, { a: 4 }, { a: 6 }]);
        });
        test("works with nested", () => {
            const collection = testCollection();
            collection.insert([
                { a: { b: { c: 2 } } },
                { a: { b: { c: 4 } } },
                { a: { b: { c: 5 } } },
                { a: { b: { c: 6 } } },
            ]);
            const isEven = (x) => x % 2 === 0;
            const found = nrml(collection.find({ c: { $fn: isEven } }));
            expect(found).toEqual([{ a: { b: { c: 2 } } }, { a: { b: { c: 4 } } }, { a: { b: { c: 6 } } }]);
        });
        test("multiple functions", () => {
            const collection = testCollection();
            collection.insert([
                { a: 2 },
                { a: 3 },
                { a: 4 },
                { a: 5 },
                { a: 6 },
            ]);
            const isOdd = (x) => x % 2 !== 0;
            const isThree = (x) => x === 3;
            const found = nrml(collection.find({ a: { $fn: [isThree, isOdd] } }));
            expect(found).toEqual([{ a: 3 }]);
        });
    });
});