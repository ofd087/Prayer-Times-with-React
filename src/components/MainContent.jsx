// REACT IMPOTS
import { useState, useEffect } from "react";

// MUI IMPORTS
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PrayerCard from "./PrayerCard";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// OTHER IMPORTS
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";

moment.locale("ar");

const PrayersNames = [
  { key: "Fajr", displayedName: "الفجر" },
  { key: "Dhuhr", displayedName: "الظهر" },
  { key: "Asr", displayedName: "العصر" },
  { key: "Maghrib", displayedName: "المغرب" },
  { key: "Isha", displayedName: "العشاء" },
];

const cities = [
  { id: 1, name: "القاهرة", isoCode: "Cairo" },
  { id: 2, name: "الإسكندرية", isoCode: "Alexandria" },
  { id: 3, name: "الجيزة", isoCode: "Giza" },
  { id: 4, name: "القليوبية", isoCode: "Qalyubia" },
  { id: 5, name: "بور سعيد", isoCode: "Port Said" },
  { id: 6, name: "السويس", isoCode: "Suez" },
  { id: 7, name: "الأقصر", isoCode: "Luxor" },
  { id: 8, name: "الدقهلية", isoCode: "Dakahlia" },
  { id: 9, name: "طنطا", isoCode: "Tanta" },
  { id: 10, name: "أسيوط", isoCode: "Asyut" },
  { id: 11, name: "الإسماعيلية", isoCode: "Ismailia" },
  { id: 12, name: "الفيوم", isoCode: "Faiyum" },
  { id: 13, name: "الزقازيق", isoCode: "Zagazig" },
  { id: 14, name: "أسوان", isoCode: "Aswan" },
  { id: 15, name: "مطروح", isoCode: "Matrouh" },
  { id: 16, name: "البحيرة", isoCode: "Beheira" },
  { id: 17, name: "المنيا", isoCode: "Minya" },
  { id: 18, name: "بنى سويف", isoCode: "Bani Suef" },
  { id: 19, name: "قنا", isoCode: "Qena" },
  { id: 20, name: "سوهاج", isoCode: "Sohag" },
  { id: 21, name: "المنوفية", isoCode: "Monufia" },
  { id: 22, name: "كفر الشيخ", isoCode: "Kafr el-Sheikh" },
  { id: 23, name: "العريش", isoCode: "Arish" },
  { id: 24, name: "جنوب سيناء", isoCode: "South Sinai" },
];

const citiesList = cities.map((city) => {
  return (
    <MenuItem key={city.id} value={city.isoCode}>
      {city.name}
    </MenuItem>
  );
});

export default function MainContent() {
  // STATES
  const [timings, setTimings] = useState({});

  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [currentRemainingTime, setCurrentRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    id: 1,
    name: "القاهرة",
    isoCode: "Cairo",
  });

  const [today, setToday] = useState("");
  //== STATES ==

  const getTimings = async () => {
    const respons = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.isoCode}`
    );
    setTimings(respons.data.data.timings);
  };

  // EFFECTS
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    const todayDate = moment().format("LLLL");
    setToday(todayDate);

    const timerInterval = setInterval(() => {
      setupCountDownTimer();
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [timings]);
  //== EFFECTS ==

  // EVENT HANDLERS
  const handleCityChange = (e) => {
    const selectedCityObject = cities.find((city) => {
      return city.isoCode == e.target.value;
    });
    setSelectedCity(selectedCityObject);
  };

  const setupCountDownTimer = () => {
    const timeNow = moment();
    let prayerIndex = 2;

    if (
      timeNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      timeNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Ase"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      timeNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      timeNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);

    const nextPrayerObj = PrayersNames[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObj.key];

    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:ss");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(timeNow);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(timeNow);
      const FajrToMidnight = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDifference = midnightDiff + FajrToMidnight;
      remainingTime = totalDifference;
    }
    const remainingTimeDuration = moment.duration(remainingTime);

    setCurrentRemainingTime(
      `${remainingTimeDuration.seconds()} : ${remainingTimeDuration.minutes()} : ${remainingTimeDuration.hours()}`
    );
  };
  //== EVENT HANDLERS ==
  return (
    <>
      {/* TOP ROW */}
      <Grid container className="header-grid">
        <Grid xs={12} md={6}>
          <div>
            <h2 className="header-h2">{today}</h2>
            <h1 className="header-h1">{selectedCity.name}</h1>
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div>
            <h2 className="header-h2">
              الوقت المتبقى حتى صلاه{" "}
              {PrayersNames[nextPrayerIndex].displayedName}
            </h2>
            <h1 className="header-h1">{currentRemainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/*== TOP ROW ==*/}

      <Divider
        variant="middle"
        sx={{ backgroundColor: "white", opacity: "0.1" }}
        fle
      />

      {/* PRAYER CARDS */}
      <Stack
        direction="row"
        justifyContent={"space-evenly"}
        // alignItems={"center"}
        style={{ marginTop: "30px", flexWrap: "wrap" }}
      >
        <PrayerCard
          name="الفجر"
          time={timings.Fajr}
          image="https://cdn.leonardo.ai/users/c0e33ebe-4c0d-4b7d-b9d7-24bbea5e7b34/generations/289d7f20-fd3a-47fd-acf4-03cb954b1e2c/Default_Muslim_before_sunrise_prayer_in_mosque_1.jpg"
        />
        <PrayerCard
          name="الظهر"
          time={timings.Dhuhr}
          image="https://cdn.leonardo.ai/users/c0e33ebe-4c0d-4b7d-b9d7-24bbea5e7b34/generations/ad83462b-e461-4723-bfcc-ee0de3bd09aa/Default_Muslim_sun_light_prayer_in_mosque_0.jpg"
        />
        <PrayerCard
          name="العصر"
          time={timings.Asr}
          image="https://cdn.leonardo.ai/users/c0e33ebe-4c0d-4b7d-b9d7-24bbea5e7b34/generations/fc4ad168-95bb-4e02-adee-030d7496393c/Default_Muslim_sunrise_prayer_in_mosque_2.jpg"
        />
        <PrayerCard
          name="المغرب"
          time={timings.Maghrib}
          image="https://cdn.leonardo.ai/users/c0e33ebe-4c0d-4b7d-b9d7-24bbea5e7b34/generations/0f5d15de-dd81-4ec7-9210-e37958025f5a/Default_Muslim_sunset_prayer_in_mosque_2.jpg"
        />
        <PrayerCard
          name="العشاء"
          time={timings.Isha}
          image="https://cdn.leonardo.ai/users/c0e33ebe-4c0d-4b7d-b9d7-24bbea5e7b34/generations/d69623f6-8be2-47df-8848-d088d05888bf/Default_Muslim_moon_light_prayer_in_mosque_1.jpg"
        />
      </Stack>
      {/*== PRAYER CARDS ==*/}

      {/* SELECT CITY */}
      <Stack
        direction="row"
        justifyContent="center"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedCity.isoCode}
            onChange={handleCityChange}
          >
            {citiesList}
          </Select>
        </FormControl>
      </Stack>
      {/*== SELECT CITY ==*/}
    </>
  );
}
