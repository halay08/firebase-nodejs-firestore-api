import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { getTimezones } from '@/app/helpers';
import * as dayJSTimezone from 'dayjs/plugin/timezone';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(dayJSTimezone);
dayjs.extend(advancedFormat);

type ITime = {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
};

const timer = (timezone?: string, time?: string) => {
    const timezones = getTimezones();

    if (timezone) {
        if (!timezones.includes(timezone)) {
            throw Error('Timezone is invalid');
        }

        return dayjs(time).tz(timezone);
    }

    return dayjs(time).utc();
};

const parseDateTime = (datetime: string, timezone?: string) => {
    return timer(timezone, datetime);
};

const getCurrentLocalDate = (timezone?: string): Date => {
    return timer(timezone).toDate();
};

/**
 * Get current UTC date
 */
const getCurrentUTCDate = (): Date => {
    return timer().toDate();
};

/**
 * @param date Add more day
 * @param days
 */
const addDate = (date?: Date, days: number = 1): Date => {
    if (!date) {
        // eslint-disable-next-line no-param-reassign
        date = getCurrentUTCDate();
    }
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

const getCustomTime = (time?: Partial<ITime>, currentTime?: Date, timezone?: string): Date => {
    const utcTime = currentTime || getCurrentUTCDate();

    const customDateTime = timer(timezone)
        .utc()
        .year(time?.year !== undefined ? time?.year : utcTime.getFullYear())
        .month(time?.month !== undefined ? time?.month : utcTime.getMonth())
        .date(time?.date !== undefined ? time?.date : utcTime.getDate())
        .hour(time?.hour !== undefined ? time?.hour : utcTime.getHours())
        .minute(time?.minute !== undefined ? time?.minute : utcTime.getMinutes())
        .second(time?.second !== undefined ? time?.second : utcTime.getSeconds())
        .second(time?.millisecond !== undefined ? time?.millisecond : utcTime.getMilliseconds());

    return customDateTime.toDate();
};

const getFormatTimeByLocale = (locale: string = 'vi-VN'): string => {
    const formats: any = {
        'es-US': 'MM/DD/YYYY HH:mm',
        'vi-VN': 'DD/MM/YYYY HH:mm'
    };

    return formats[locale];
};

export {
    timer,
    parseDateTime,
    getCurrentLocalDate,
    ITime,
    getCurrentUTCDate,
    addDate,
    getCustomTime,
    getFormatTimeByLocale
};
