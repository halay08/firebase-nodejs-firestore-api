import * as countryZones from 'countries-and-timezones';

const getCountryNames = (): Array<string> => {
    const countries = countryZones.getAllCountries();

    return Object.values(countries).map((c) => {
        return c.name;
    });
};

const getCountryCodes = (): Array<string> => {
    const countries = countryZones.getAllCountries();

    return Object.keys(countries);
};

const getTimezones = (): Array<string> => {
    const timezones = countryZones.getAllTimezones();

    return Object.values(timezones).map((c) => {
        return c.name;
    });
};

export { getCountryNames, getTimezones, getCountryCodes };
