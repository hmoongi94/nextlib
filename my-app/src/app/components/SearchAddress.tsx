"use client";
import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import DaumPostcode from "react-daum-postcode";
import { useRouter } from "next/navigation";
import getAddress from "@/app/components/GetAddress";
import styles from "@/styles/searchaddress.module.scss";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    onSelectAddress: (data: any) => void;
    onSelectZonecode: (zonecode: any) => void;
}

const Search = ({
    open,
    onClose,
    onSelectAddress,
    onSelectZonecode,
    children,
}: ModalProps) => {
    const router = useRouter();

    useEffect(() => {
        const handleBackButton = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            router.back();
        };

        window.addEventListener("beforeunload", handleBackButton);

        return () => {
            window.removeEventListener("beforeunload", handleBackButton);
        };
    }, [router]);

    const handleComplete = (data: any) => {
        const address = getAddress(data);
        onSelectAddress(address);
        onSelectZonecode(data.zonecode);
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div className={styles.overlayStyle} />
            <div className={styles.modalStyle}>
                <DaumPostcode onComplete={handleComplete} />

                <button onClick={onClose}>닫기</button>
            </div>
        </>,
        document.getElementById("global-modal") as HTMLElement
    );
};

export default Search;