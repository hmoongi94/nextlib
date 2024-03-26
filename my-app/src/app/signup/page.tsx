"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import styles from "@/app/styles/signup.module.scss";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import Search from "@/app/components/SearchAddress";
import { ko } from "date-fns/locale";

interface SignUpProps {
  signup?: {
    userId?: string;
    password?: string;
    name?: string;
    birthdate?: string;
    phoneNumber?: string;
    email?: string;
    postcode?: string;
    address?: string;
    detailaddress?: string;
    gender?: string;
  };
}

const SignUp: NextPage<SignUpProps> = ({ signup = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailaddress, setDetailaddress] = useState<string>("");
  const [address, setaddress] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<{
    userId: string;
    password: string;
    name: string;
    birthdate: Date;
    phoneNumber: string;
    email: string;
    postcode: string;
    address: string;
    detailaddress: string;
    gender: string;
  }>({
    userId: signup.userId || "",
    password: signup.password || "",
    name: signup.name || "",
    birthdate: signup.birthdate ? new Date(signup.birthdate) : new Date(),
    phoneNumber: signup.phoneNumber || "",
    email: signup.email || "",
    postcode: signup.postcode || "",
    address: signup.address || "",
    detailaddress: signup.detailaddress || "",
    gender: signup.gender || "",
  });

  const [isUserIdValid, setIsUserIdValid] = useState<
    "unknown" | boolean | null
  >(null);

  const handleSearch = () => {
    setIsModalOpen(true);
  };

  const getaddress = (data: any) => {
    const address1 = data;
    return address1;
  };

  const handleSelectaddress = (data: any) => {
    const address = getaddress(data);

    setaddress(address);
    setIsModalOpen(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: address,
    }));
  };

  const handleSelectZonecode = (data: any) => {
    const postcodeData = getaddress(data);

    setPostcode(postcodeData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      postcode: postcodeData,
    }));
  };

  const router = useRouter();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Date
  ) => {
    if (event instanceof Date) {
      setFormData({
        ...formData,
        birthdate: event,
      });
    } else {
      const target = event.target as HTMLInputElement | HTMLSelectElement;

      if (target.name === "password") {
        const password = target.value;

        const passwordPattern =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
        const isValid = passwordPattern.test(password);

        setFormData({
          ...formData,
          password: password,
        });

        setIsPasswordValid(isValid);
      }

      if (target.name === "passwordConfirm") {
        const confirmPassword = target.value;

        setIsPasswordMatch(confirmPassword === formData.password);

        setPasswordConfirm(confirmPassword);
      }

      if (
        target.name === "postcode" ||
        target.name === "address" ||
        target.name === "detailaddress"
      ) {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      } else {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });

        if (target.name === "userId") {
          setIsUserIdValid(null);
        }
      }
    }
  };
  const handleCheckDuplicate = async (body: any) => {
    const userId = formData.userId;

    const idPattern = /^(?=.*[a-zA-Z]|.*\d)[a-zA-Z0-9]{5,12}$/;

  if (!idPattern.test(userId)) {
    alert("5자 이상 12자 이하이어야 합니다.");
    return;
  }
    try {
      const response = await fetch(`/api/checkDuplicate?userId=${formData.userId}`, {
        method: "GET",
      });

      const data = await response.json();
  
      setIsUserIdValid(!data.isDuplicate);
    } catch (error) {
      console.error("Error checking duplicate:", error);
    }
  };
  
  const handleSubmitClick = async () => {
    
    if (!isUserIdValid) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value === ""
    );

    if (isAnyFieldEmpty) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.message === "회원가입 성공") {
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange("postcode", value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange("address", value);
  };

  return (
    <div className={styles.main}>
      <div>
        <form>
          <div>
            <label>
              ID
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={styles.input}
                placeholder="5자 이상 12자 이하"
              />
            </label>
            <button
              type="button"
              onClick={handleCheckDuplicate}
              className={styles.duplicateBtn}
            >
              중복 확인
            </button>
            {isUserIdValid === null ? null : (
              <span className={styles.validMessage}>
                {isUserIdValid === true
                  ? "사용 가능한 아이디입니다."
                  : "이미 사용 중인 아이디입니다."}
              </span>
            )}
          </div>
          <div>
            <label>
              비밀번호
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder=" 8글자 이상, 영문, 숫자, 특수문자를 포함하세요"
              />
            </label>
            {isPasswordValid === false && (
              <span className={styles.validMessage}>
                비밀번호는 8글자 이상, 영문, 숫자, 특수문자를 모두 사용해야
                합니다.
              </span>
            )}
          </div>
          <div>
            <label>비밀번호 확인
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleChange}
              className={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              />
            {isPasswordMatch !== null && (
              <span className={styles.validMessage}>
                {isPasswordMatch
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </span>
            )}
            </label>
          </div>
          <div>
            <label>
              이름
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={styles.input}
              />
            </label>
          </div>
          <div>
            <label>
              생년월일
              <DatePicker
                className={styles.input}
                selected={formData.birthdate}
                onChange={(date: Date) => handleChange(date)}
                locale={ko}
                showMonthDropdown
                showYearDropdown
                dateFormat="yyyy년 MM월 dd일"
              />
            </label>
          </div>
          <div>
            <label>
              휴대폰번호
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="숫자만 입력하세요"
              />
            </label>
          </div>
          <div>
            <label>
              이메일
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>
          <div>
            <label>
              주소
              <div>
                <input
                  name="postcode"
                  type="text"
                  placeholder="우편번호"
                  value={postcode}
                  onChange={handlePostcodeChange}
                  readOnly
                />
                <div onClick={() => setIsModalOpen(true)}>주소 검색</div>
                <Search
                  open={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                  }}
                  onSelectAddress={handleSelectaddress}
                  onSelectZonecode={handleSelectZonecode}
                >
                  모달 내용
                </Search>
              </div>
              <input
                type="text"
                name="address"
                placeholder="주소"
                value={address}
                onChange={handleAddressChange}
                readOnly
              />
              <input
                name="detailaddress"
                type="text"
                placeholder="상세주소"
                value={detailaddress}
                onChange={(e) => {
                  setDetailaddress(e.target.value);
                  handleChange(e);
                }}
              />
            </label>
          </div>
          <div>
            <label>
              성별
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">선택하세요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={isUserIdValid === false}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;