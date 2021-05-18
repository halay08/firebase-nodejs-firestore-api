import { isJSON } from '../validation';

describe('#isJSON()', () => {
    it("when param's `something`, return false", async () => {
        expect(isJSON('something')).toBe(false);
    });

    it("when param's empty, return false", async () => {
        expect(isJSON('')).toBe(false);
    });

    it('when param\'s `"{ foo: 42 }"`, return false', async () => {
        expect(isJSON('')).toBe(false);
    });

    it('when param\'s `"something"`, return true', async () => {
        expect(isJSON('"something"')).toBe(true);
    });

    it('when param\'s `"{ "foo": 42 }"`, return true', async () => {
        expect(isJSON('{ "foo": 42 }')).toBe(true);
    });
});
