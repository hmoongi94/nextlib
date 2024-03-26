export default function getAddress(data: any) {
  let extraAddress = "";
  let address = data.address;

  if (data.addressType === "R") {
      if (data.bname !== "") {
          extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
          extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      address += extraAddress !== "" ? ` (${extraAddress})` : "";
  }
  return address;
}