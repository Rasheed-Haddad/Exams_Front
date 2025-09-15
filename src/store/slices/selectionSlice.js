import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const mockUniversities = [
  { id: "1", name: "الجامعة الدولية", location: "درعا" },
  {
    id: "2",
    name: "الجامعة السورية الخاصة",
    location: "ريف دمشق",
  },
  {
    id: "3",
    name: "الجامعة العربية الخاصة ",
    location: "طريق حمص - حماة",
  },
  {
    id: "4",
    name: "الجامعة العربية الدولية",
    location: "درعا",
  },
  { id: "5", name: "الجامعة الوطنية الخاصة", location: "حماة" },
  { id: "6", name: "جامعة أنطاكية الخاصة", location: "ريف دمشق" },
  { id: "7", name: "جامعة الأندلس ", location: "طرطوس" },
  { id: "8", name: "جامعة الحواش الخاصة", location: "وادي النصارى" },
  { id: "9", name: "جامعة الشام الخاصة", location: "دمشق" },
  { id: "10", name: "جامعة الشهباء الخاصة", location: "حلب" },
  { id: "11", name: "جامعة الفرات", location: "دير الزور" },
  { id: "12", name: "جامعة القلمون الخاصة", location: "دير عطية" },
  { id: "13", name: "جامعة المنارة الخاصة", location: "اللاذقية" },
  { id: "14", name: "جامعة الوادي الدولية", location: "وادي النصارى" },
  { id: "15", name: "جامعة حماة", location: "حماة" },
  { id: "16", name: "جامعة حلب", location: "حلب" },
  { id: "17", name: "جامعة دمشق", location: "دمشق" },
  { id: "18", name: "جامعة حمص", location: "حمص" },
  {
    id: "19",
    name: "جامعة الرشيد الدولية ",
    location: "درعا",
  },
  { id: "20", name: "جامعة طرطوس", location: "طرطوس" },
  { id: "21", name: "جامعة اللاذقية", location: "اللاذقية" },
  { id: "22", name: "جامعة قرطبة", location: "حلب" },
  {
    id: "23",
    name: "جامعة قاسبون الخاصة ",
    location: "جباب",
  },
];

export const mockColleges = {
  1: [
    { id: "1", name: "طب الأسنان", universityId: "1" },
    { id: "2", name: "الصيدلة", universityId: "1" },
    { id: "3", name: "الهندسة والتكنولوجيا", universityId: "1" },
    { id: "4", name: "تكنولوجيا المعلومات", universityId: "1" },
    { id: "5", name: "إدارة الأعمال والمالية", universityId: "1" },
    { id: "6", name: "الفنون والعلوم", universityId: "1" },
    { id: "7", name: "الهندسة المعمارية", universityId: "1" },
  ],
  2: [
    { id: "8", name: "الطب البشري", universityId: "2" },
    { id: "9", name: "طب الأسنان", universityId: "2" },
    { id: "10", name: "الصيدلة", universityId: "2" },
    { id: "11", name: "الهندسة", universityId: "2" },
    { id: "12", name: "هندسة البترول", universityId: "2" },
    { id: "13", name: "العلوم الإدارية", universityId: "2" },
  ],
  3: [
    { id: "14", name: "الصيدلة", universityId: "3" },
    { id: "15", name: "الهندسة المعلوماتية", universityId: "3" },
    { id: "16", name: "الهندسة الكيميائية", universityId: "3" },
    { id: "17", name: "الهندسة البترولية", universityId: "3" },
    { id: "18", name: "طب الأسنان", universityId: "3" },
    { id: "19", name: "الترجمة واللغات", universityId: "3" },
    { id: "20", name: "الهندسة المعمارية", universityId: "3" },
  ],
  4: [
    { id: "21", name: "الصيدلة", universityId: "4" },
    { id: "22", name: "طب الأسنان", universityId: "4" },
    { id: "23", name: "الهندسة المعلوماتية والاتصالات", universityId: "4" },
    { id: "24", name: "الهندسة المدنية", universityId: "4" },
    { id: "25", name: "إدارة الأعمال", universityId: "4" },
    { id: "26", name: "الحقوق", universityId: "4" },
    { id: "27", name: "الهندسة المعمارية", universityId: "4" },
    { id: "28", name: "الفنون", universityId: "4" },
    { id: "29", name: "العلوم الإنسانية", universityId: "4" },
  ],
  5: [
    { id: "30", name: "الهندسة", universityId: "5" },
    { id: "31", name: "الصيدلة", universityId: "5" },
    { id: "32", name: "طب الأسنان", universityId: "5" },
    { id: "33", name: "العمارة", universityId: "5" },
    { id: "34", name: "الإدارة والعلوم المالية", universityId: "5" },
  ],
  6: [
    { id: "35", name: "الهندسة المعمارية", universityId: "6" },
    { id: "36", name: "الصيدلة", universityId: "6" },
    { id: "37", name: "الهندسة المدنية", universityId: "6" },
    { id: "38", name: "هندسة الحاسوب", universityId: "6" },
    { id: "39", name: "الحقوق", universityId: "6" },
    { id: "40", name: "العلوم الإدارية والاقتصادية", universityId: "6" },
  ],
  7: [
    { id: "41", name: "الطب البشري", universityId: "7" },
    { id: "42", name: "طب الأسنان", universityId: "7" },
    { id: "43", name: "الصيدلة", universityId: "7" },
    { id: "44", name: "التمريض", universityId: "7" },
    { id: "45", name: "الهندسة الطبية", universityId: "7" },
    { id: "46", name: "إدارة المشافي", universityId: "7" },
  ],
  8: [
    { id: "47", name: "الطب البشري", universityId: "8" },
    { id: "48", name: "طب الأسنان", universityId: "8" },
    { id: "49", name: "الصيدلة", universityId: "8" },
    { id: "50", name: "التمريض", universityId: "8" },
    { id: "51", name: "الهندسة المعلوماتية", universityId: "8" },
    { id: "52", name: "الهندسة المدنية", universityId: "8" },
    { id: "53", name: "الهندسة المعمارية", universityId: "8" },
    { id: "54", name: "التجميل", universityId: "8" },
    { id: "55", name: "الحقوق", universityId: "8" },
    { id: "56", name: "ريادة الأعمال", universityId: "8" },
    { id: "57", name: "الإعلام", universityId: "8" },
  ],
  9: [
    { id: "58", name: "الحقوق", universityId: "9" },
    { id: "59", name: "العلوم الإدارية", universityId: "9" },
    { id: "60", name: "العلاقات الدولية والدبلوماسية", universityId: "9" },
    { id: "61", name: "الصيدلة", universityId: "9" },
    { id: "62", name: "الطب البشري", universityId: "9" },
    { id: "63", name: "الهندسة المعلوماتية", universityId: "9" },
    { id: "64", name: "طب الأسنان", universityId: "9" },
  ],
  10: [
    { id: "65", name: "طب الأسنان", universityId: "10" },
    { id: "66", name: "هندسة المعلومات", universityId: "10" },
    { id: "67", name: "الأعمال والإدارة", universityId: "10" },
  ],
  11: [
    { id: "68", name: "طب الأسنان", universityId: "11" },
    { id: "69", name: "الطب البشري", universityId: "11" },
    { id: "70", name: "التمريض", universityId: "11" },
    { id: "71", name: "الهندسة البتروكيميائية", universityId: "11" },
    { id: "72", name: "الزراعة", universityId: "11" },
    { id: "73", name: "العلوم", universityId: "11" },
    { id: "74", name: "الحقوق", universityId: "11" },
    { id: "75", name: "الاقتصاد", universityId: "11" },
    { id: "76", name: "الآداب والعلوم الإنسانية", universityId: "11" },
    { id: "77", name: "التربية", universityId: "11" },
    { id: "78", name: "الطب البيطري", universityId: "11" },
    { id: "79", name: "الهندسة الميكانيكية والكهربائية", universityId: "11" },
    { id: "80", name: "الهندسة المدنية", universityId: "11" },
    { id: "81", name: "الهندسة الزراعية", universityId: "11" },
  ],
  12: [
    { id: "82", name: "الطب البشري", universityId: "12" },
    { id: "83", name: "طب الأسنان", universityId: "12" },
    { id: "84", name: "الصيدلة", universityId: "12" },
    { id: "85", name: "هندسة تقانة المعلومات", universityId: "12" },
    { id: "86", name: "هندسة الاتصالات والالكترونيات", universityId: "12" },
    { id: "87", name: "الهندسة المعمارية", universityId: "12" },
    { id: "88", name: "هندسة الحواسيب", universityId: "12" },
    { id: "89", name: "الهندسة المدنية", universityId: "12" },
    { id: "90", name: "العلوم التطبيقية", universityId: "12" },
    { id: "91", name: "الإدارة", universityId: "12" },
    { id: "92", name: "التمويل والبنوك", universityId: "12" },
    { id: "93", name: "نظم المعلومات الإدارية", universityId: "12" },
    { id: "94", name: "التسويق", universityId: "12" },
    { id: "95", name: "العلوم الدبلوماسية", universityId: "12" },
    { id: "96", name: "العلاقات الدولية", universityId: "12" },
    { id: "97", name: "التغذية وعلوم الأغذية", universityId: "12" },
    { id: "98", name: "التعويضات السنية", universityId: "12" },
    { id: "99", name: "التصميم الداخلي", universityId: "12" },
    { id: "100", name: "التصميم الغرافيكي", universityId: "12" },
  ],
  13: [
    { id: "101", name: "طب الأسنان", universityId: "13" },
    { id: "102", name: "الصيدلة", universityId: "13" },
    { id: "103", name: "الهندسة", universityId: "13" },
    { id: "104", name: "هندسة العمارة", universityId: "13" },
    { id: "105", name: "إدارة الأعمال", universityId: "13" },
    { id: "106", name: "فنون الأداء", universityId: "13" },
  ],
  14: [
    { id: "107", name: "الصيدلة", universityId: "14" },
    { id: "108", name: "الهندسة", universityId: "14" },
    { id: "109", name: "طب الأسنان", universityId: "14" },
    { id: "110", name: "العلوم الإدارية والاقتصادية", universityId: "14" },
    { id: "111", name: "الحقوق", universityId: "14" },
  ],
  15: [
    { id: "112", name: "الطب البشري", universityId: "15" },
    { id: "113", name: "طب الأسنان", universityId: "15" },
    { id: "114", name: "الصيدلة", universityId: "15" },
    { id: "115", name: "التمريض", universityId: "15" },
    { id: "116", name: "الطب البيطري", universityId: "15" },
    { id: "117", name: "التربية الرياضية", universityId: "15" },
    { id: "118", name: "الهندسة الزراعية", universityId: "15" },
    { id: "119", name: "الهندسة المعمارية", universityId: "15" },
    { id: "120", name: "الهندسة المدنية", universityId: "15" },
    { id: "121", name: "العلوم التطبيقية", universityId: "15" },
    { id: "122", name: "الهندسة الكهربائية", universityId: "15" },
    { id: "123", name: "الآداب والعلوم الإنسانية", universityId: "15" },
    { id: "124", name: "التربية", universityId: "15" },
    { id: "125", name: "الاقتصاد", universityId: "15" },
    { id: "126", name: "العلوم", universityId: "15" },
  ],
  16: [
    { id: "127", name: "الطب البشري", universityId: "16" },
    { id: "128", name: "طب الأسنان", universityId: "16" },
    { id: "129", name: "الصيدلة", universityId: "16" },
    { id: "130", name: "التمريض", universityId: "16" },
    { id: "131", name: "الهندسة الزراعية", universityId: "16" },
    { id: "132", name: "الهندسة المعمارية", universityId: "16" },
    { id: "133", name: "الهندسة المدنية", universityId: "16" },
    { id: "134", name: "الهندسة الكهربائية والالكترونية", universityId: "16" },
    { id: "135", name: "الهندسة المعلوماتية", universityId: "16" },
    { id: "136", name: "العلوم", universityId: "16" },
    { id: "137", name: "الاقتصاد", universityId: "16" },
    { id: "138", name: "الآداب والعلوم الإنسانية", universityId: "16" },
    { id: "139", name: "التربية", universityId: "16" },
    { id: "140", name: "الحقوق", universityId: "16" },
    { id: "141", name: "الشريعة", universityId: "16" },
    { id: "142", name: "الفنون الجميلة التطبيقية", universityId: "16" },
  ],
  17: [
    { id: "143", name: "الطب البشري", universityId: "17" },
    { id: "144", name: "طب الأسنان", universityId: "17" },
    { id: "145", name: "الصيدلة", universityId: "17" },
    { id: "146", name: "العلوم الصحية", universityId: "17" },
    { id: "147", name: "الهندسة الميكانيكية والكهربائية", universityId: "17" },
    { id: "148", name: "الهندسة المدنية", universityId: "17" },
    { id: "149", name: "الهندسة المعمارية", universityId: "17" },
    { id: "150", name: "الهندسة المعلوماتية", universityId: "17" },
    { id: "151", name: "الآداب والعلوم الإنسانية", universityId: "17" },
    { id: "152", name: "التربية", universityId: "17" },
    { id: "153", name: "الحقوق", universityId: "17" },
    { id: "154", name: "الاقتصاد", universityId: "17" },
    { id: "155", name: "الشريعة", universityId: "17" },
    { id: "156", name: "الإعلام", universityId: "17" },
    { id: "157", name: "العلوم السياسية", universityId: "17" },
    { id: "158", name: "الزراعة", universityId: "17" },
    { id: "159", name: "الفنون الجميلة", universityId: "17" },
    { id: "160", name: "العلوم", universityId: "17" },
    { id: "161", name: "السياحة", universityId: "17" },
    { id: "162", name: "التنمية الإدارية", universityId: "17" },
  ],
  18: [
    { id: "163", name: "الطب البشري", universityId: "18" },
    { id: "164", name: "طب الأسنان", universityId: "18" },
    { id: "165", name: "الصيدلة", universityId: "18" },
    { id: "166", name: "العلوم الصحية", universityId: "18" },
    { id: "167", name: "الهندسة المعلوماتية", universityId: "18" },
    { id: "168", name: "الهندسة المدنية", universityId: "18" },
    { id: "169", name: "الهندسةالمعمارية", universityId: "18" },
    { id: "170", name: "الهندسة الكيميائية والبترولية", universityId: "18" },
    { id: "171", name: "الهندسة الميكانيكية والكهربائية", universityId: "18" },
    { id: "172", name: "الهندسة الزراعية", universityId: "18" },
    { id: "173", name: "الهندسة التطبيقية", universityId: "18" },
    { id: "174", name: "الآداب والعلوم الإنسانية", universityId: "18" },
    { id: "175", name: "العلوم الاقتصادية", universityId: "18" },
    { id: "176", name: "العلوم الأساسية", universityId: "18" },
    { id: "177", name: "الحقوق", universityId: "18" },
    { id: "178", name: "السياحة", universityId: "18" },
    { id: "179", name: "التربية", universityId: "18" },
  ],
  19: [
    { id: "180", name: "طب الأسنان", universityId: "19" },
    { id: "181", name: "الصيدلة", universityId: "19" },
    { id: "182", name: "الهندسة المعمارية", universityId: "19" },
    { id: "183", name: "الحقوق", universityId: "19" },
    { id: "184", name: "الهندسة المعلوماتية", universityId: "19" },
    { id: "185", name: "هندسة الميكاترونيكس", universityId: "19" },
    { id: "186", name: "هندسة الاتصالات", universityId: "19" },
    { id: "187", name: "المعالجة الفيزيائية", universityId: "19" },
    { id: "188", name: "الإدارة", universityId: "19" },
  ],
  20: [
    { id: "190", name: "الطب البشري", universityId: "20" },
    { id: "191", name: "طب الأسنان", universityId: "20" },
    { id: "192", name: "الصيدلة", universityId: "20" },
    { id: "193", name: "السياحة", universityId: "20" },
    { id: "194", name: "الهندسة المعمارية", universityId: "20" },
    { id: "195", name: "الآداب", universityId: "20" },
    { id: "196", name: "الهندسة التقنية", universityId: "20" },
    { id: "197", name: "التربية", universityId: "20" },
    { id: "198", name: "العلوم", universityId: "20" },
    {
      id: "199",
      name: "هندسة تكنولوجيا المعلومات والاتصالات",
      universityId: "20",
    },
  ],
  21: [
    { id: "200", name: "الطب البشري", universityId: "21" },
    { id: "201", name: "طب الأسنان", universityId: "21" },
    { id: "202", name: "الصيدلة", universityId: "21" },
    { id: "203", name: "التمريض", universityId: "21" },
    { id: "204", name: "التربية الرياضية", universityId: "21" },
    { id: "205", name: "الهندسة الميكانيكية والكهربائية", universityId: "21" },
    { id: "206", name: "الهندسة المدنية", universityId: "21" },
    { id: "207", name: "الهندسة الزراعية", universityId: "21" },
    { id: "208", name: "الهندسة المعمارية", universityId: "21" },
    { id: "209", name: "العلوم", universityId: "21" },
    { id: "210", name: "الآداب والعلوم الإنسانية", universityId: "21" },
    { id: "211", name: "التربية", universityId: "21" },
    { id: "212", name: "الحقوق", universityId: "21" },
    { id: "213", name: "الفنون الجميلة", universityId: "21" },
    { id: "214", name: "الاقتصاد", universityId: "21" },
  ],
  22: [
    { id: "215", name: "طب الأسنان", universityId: "22" },
    { id: "216", name: "الهندسة المعلوماتية", universityId: "22" },
    { id: "217", name: "هندسة الاتصالات", universityId: "22" },
    { id: "218", name: "الهندسة المعمارية", universityId: "22" },
    { id: "219", name: "العلوم الإدارية والمالية", universityId: "22" },
    { id: "220", name: "اللغات الحية والعلوم الإنسانية", universityId: "22" },
  ],
  23: [
    { id: "221", name: "طب الأسنان", universityId: "23" },
    { id: "222", name: "الصيدلة", universityId: "23" },
    { id: "223", name: "الهندسة المعمارية", universityId: "23" },
    { id: "224", name: "هندسة الاتصالات", universityId: "23" },
    { id: "225", name: "الهندسة المعلوماتية", universityId: "23" },
    { id: "226", name: "إدارة الأعمال", universityId: "23" },
    { id: "227", name: "التسويق", universityId: "23" },
    { id: "228", name: "التمويل", universityId: "23" },
    { id: "229", name: "المحاسبة", universityId: "23" },
    { id: "230", name: "الآداب", universityId: "23" },
  ],
};

export const fetchUniversities = createAsyncThunk(
  "selection/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockUniversities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchColleges = createAsyncThunk(
  "selection/fetchColleges",
  async (universityId, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockColleges[universityId] || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubjects = createAsyncThunk(
  "selection/fetchSubjects",
  async ({ college_id, ID }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://exams-back.onrender.com/subjects",
        { college_id: college_id, ID: ID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return rejectWithValue(
          "انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مجددًا."
        );
      }

      return rejectWithValue("تأكد من اتصالك بالإنترنت أو من صلاحية الدخول");
    }
  }
);

const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    universities: [],
    colleges: [],
    subjects: [],
    selectedUniversity: null,
    selectedCollege: null,
    selectedSubject: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectUniversity: (state, action) => {
      state.selectedUniversity = action.payload;
      state.selectedCollege = null;
      state.selectedSubject = null;
      state.colleges = [];
      state.subjects = [];
    },
    selectCollege: (state, action) => {
      state.selectedCollege = action.payload;
      state.selectedSubject = null;
      state.subjects = [];
    },
    selectSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    resetSelections: (state) => {
      state.selectedUniversity = null;
      state.selectedCollege = null;
      state.selectedSubject = null;
      state.colleges = [];
      state.subjects = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Universities
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = action.payload;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Colleges
      .addCase(fetchColleges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = action.payload;
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectUniversity,
  selectCollege,
  selectSubject,
  resetSelections,
  clearError,
} = selectionSlice.actions;
export default selectionSlice.reducer;
