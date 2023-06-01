import { useRecoilValue } from "recoil";
import { isTokenAtom } from "../../recoil/tokenAtom";
import { userAtom } from "../../recoil/userAtom";
import { useEffect, useState } from "react";
import { customAxios } from "../../lib/axios/customAxios";
import showToast from "../../lib/toast/toast";

const useHome = () => {
  const isToken = useRecoilValue(isTokenAtom);
  const user = useRecoilValue(userAtom);
  const [content, setContent] = useState({
    afterClass: ["로그인 이후에 사용 가능합니다"],
    attendance: "로그인 이후에 사용 가능합니다",
    smallAdv:
      "https://post-phinf.pstatic.net/MjAyMTAzMjBfMjUy/MDAxNjE2MjExODA3NzMx.ZgRyBenF0yWC1lS6azKbeFhqFhA40Hs9cH2pqZSeiE8g.cDCjirkHy16khQJYlcIwP3Ij01hfQTJ_BvTQGXBTcc4g.JPEG/mug_obj_202103201243289114.jpg?type=w1080",
    bigAdv: ["https://t1.daumcdn.net/cfile/tistory/2207573D58CFDE2704"],
    survey: "로그인 이후에 사용 가능합니다",
    meal: ["로그인 이후에 사용 가능합니다"],
    school: undefined,
  });

  const getClassData = async () => {
    if (isToken) {
      try {
        const { data } = await customAxios.get("/apply/my");
        if (data.status === 200) {
          if (data.data.length === 0) {
            setContent((current) => {
              let newContent = { ...current };
              newContent["afterClass"] = ["신청한 방과후가 없습니다"];
              return newContent;
            });
          } else {
            setContent((current) => {
              let newContent = { ...current };
              newContent["afterClass"] = data.data;
              return newContent;
            });
          }
        }
      } catch (error) {
        const data = error.response;
        showToast(data.message, "ERROR");
      }
    }
  };

  const getAttendanceData = async () => {
    if (isToken) {
      try {
        setContent((current) => {
          let newContent = { ...current };
          newContent["attendance"] = "출석 체크하러 가기";
          return newContent;
        });
      } catch (error) {
        const data = error.response;
        showToast(data.message, "ERROR");
        return;
      }
    }
  };

  const getSurveyData = async () => {
    if (isToken) {
      try {
        setContent((current) => {
          let newContent = { ...current };
          newContent["survey"] = "출석 체크하러 가기";
          return newContent;
        });
      } catch (error) {
        const data = error.response;
        showToast(data.message, "ERROR");
        return;
      }
    }
  };

  const getMealData = async (schoolId) => {
    if (isToken) {
      try {
        const { data } = await customAxios.get(`/meal/${schoolId}`);
        if (data.status === 200) {
          if (data.data.length === 0) {
            setContent((current) => {
              let newContent = { ...current };
              newContent["meal"] = ["오늘은 급식이 없습니다"];
              return newContent;
            });
          } else {
            setContent((current) => {
              let newContent = { ...current };
              newContent["meal"] = data.data;
              return newContent;
            });
          }
        }
      } catch (error) {
        const data = error.response;
        showToast(data.message, "ERROR");
        return;
      }
    }
  };

  const getSchooldata = async (homepage) => {
    if (isToken) {
      setContent((current) => {
        let newContent = { ...current };
        newContent["school"] = homepage;
        return newContent;
      });
    }
  };

  const renderContent = async () => {
    await getClassData(); //class
    await getAttendanceData(); //attendance
    await getSurveyData(); //survey
    await getMealData(user.schoolId); //meal
    //adv
    await getSchooldata(); //schoolInfo
  };

  const sumitSchool = () => {
    if (content.school) {
      window.location.href = content.school;
    } else {
      showToast("학교사이트 주소가 등록되어 있지 않았습니다", "INFO");
    }
  };

  useEffect(() => {
    renderContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sumitSchool,
    content,
  };
};

export default useHome;