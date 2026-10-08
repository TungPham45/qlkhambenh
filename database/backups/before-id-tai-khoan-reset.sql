--
-- PostgreSQL database dump
--

\restrict n1KzGdG9bPBw8QtiBTqaIoeuxB9Rs5Pf4UzNtpdds9H20OGPU6jIAAd5XsJ8p4L

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tiep_nhan_benh_nhan DROP CONSTRAINT IF EXISTS fk_tiep_nhan_lich_hen;
ALTER TABLE IF EXISTS ONLY public.tien_su_benh DROP CONSTRAINT IF EXISTS fk_tien_su_benh_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.thong_bao DROP CONSTRAINT IF EXISTS fk_thong_bao_tai_khoan;
ALTER TABLE IF EXISTS ONLY public.thong_bao DROP CONSTRAINT IF EXISTS fk_thong_bao_lich_hen;
ALTER TABLE IF EXISTS ONLY public.thanh_toan DROP CONSTRAINT IF EXISTS fk_thanh_toan_hoa_don;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS fk_tai_khoan_quan_ly;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS fk_tai_khoan_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS fk_tai_khoan_bac_si;
ALTER TABLE IF EXISTS ONLY public.quan_ly DROP CONSTRAINT IF EXISTS fk_quan_ly_tai_khoan;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS fk_phieu_kham_lich_hen_snapshot;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS fk_phieu_kham_lich_hen;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS fk_phieu_kham_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS fk_phieu_kham_bac_si;
ALTER TABLE IF EXISTS ONLY public.nhat_ky_hoat_dong DROP CONSTRAINT IF EXISTS fk_nhat_ky_tai_khoan;
ALTER TABLE IF EXISTS ONLY public.lich_su_lich_hen DROP CONSTRAINT IF EXISTS fk_lich_su_nguoi_thay_doi;
ALTER TABLE IF EXISTS ONLY public.lich_su_lich_hen DROP CONSTRAINT IF EXISTS fk_lich_su_lich_hen;
ALTER TABLE IF EXISTS ONLY public.lich_lam_viec DROP CONSTRAINT IF EXISTS fk_lich_lam_viec_bac_si;
ALTER TABLE IF EXISTS ONLY public.lich_hen DROP CONSTRAINT IF EXISTS fk_lich_hen_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.lich_hen DROP CONSTRAINT IF EXISTS fk_lich_hen_bac_si;
ALTER TABLE IF EXISTS ONLY public.hoa_don DROP CONSTRAINT IF EXISTS fk_hoa_don_phieu_kham_snapshot;
ALTER TABLE IF EXISTS ONLY public.hoa_don DROP CONSTRAINT IF EXISTS fk_hoa_don_phieu_kham;
ALTER TABLE IF EXISTS ONLY public.hoa_don DROP CONSTRAINT IF EXISTS fk_hoa_don_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.goi_y_thuoc DROP CONSTRAINT IF EXISTS fk_goi_y_thuoc_thuoc;
ALTER TABLE IF EXISTS ONLY public.goi_y_thuoc DROP CONSTRAINT IF EXISTS fk_goi_y_thuoc_benh;
ALTER TABLE IF EXISTS ONLY public.giao_dich_kho_thuoc DROP CONSTRAINT IF EXISTS fk_giao_dich_xuat_don_thuoc_chi_tiet;
ALTER TABLE IF EXISTS ONLY public.giao_dich_kho_thuoc DROP CONSTRAINT IF EXISTS fk_giao_dich_tham_chieu_don_thuoc;
ALTER TABLE IF EXISTS ONLY public.giao_dich_kho_thuoc DROP CONSTRAINT IF EXISTS fk_giao_dich_kho_thuoc;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS fk_don_thuoc_phieu_kham_snapshot;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS fk_don_thuoc_phieu_kham;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS fk_don_thuoc_benh_nhan;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS fk_don_thuoc_bac_si;
ALTER TABLE IF EXISTS ONLY public.chi_tiet_don_thuoc DROP CONSTRAINT IF EXISTS fk_ctdt_thuoc;
ALTER TABLE IF EXISTS ONLY public.chi_tiet_don_thuoc DROP CONSTRAINT IF EXISTS fk_ctdt_don_thuoc;
ALTER TABLE IF EXISTS ONLY public.chan_doan DROP CONSTRAINT IF EXISTS fk_chan_doan_phieu_kham;
ALTER TABLE IF EXISTS ONLY public.chan_doan DROP CONSTRAINT IF EXISTS fk_chan_doan_danh_muc_benh;
ALTER TABLE IF EXISTS ONLY public.bac_si_chuyen_khoa DROP CONSTRAINT IF EXISTS fk_bsck_chuyen_khoa;
ALTER TABLE IF EXISTS ONLY public.bac_si_chuyen_khoa DROP CONSTRAINT IF EXISTS fk_bsck_bac_si;
ALTER TABLE IF EXISTS ONLY public.benh_nhan DROP CONSTRAINT IF EXISTS fk_benh_nhan_tai_khoan;
ALTER TABLE IF EXISTS ONLY public.bac_si DROP CONSTRAINT IF EXISTS fk_bac_si_tai_khoan;
DROP TRIGGER IF EXISTS trg_thuoc_ngay_cap_nhat ON public.thuoc;
DROP TRIGGER IF EXISTS trg_tai_khoan_ngay_cap_nhat ON public.tai_khoan;
DROP TRIGGER IF EXISTS trg_phieu_kham_ngay_cap_nhat ON public.phieu_kham;
DROP TRIGGER IF EXISTS trg_lich_lam_viec_ngay_cap_nhat ON public.lich_lam_viec;
DROP TRIGGER IF EXISTS trg_lich_hen_ngay_cap_nhat ON public.lich_hen;
DROP TRIGGER IF EXISTS trg_hoa_don_ngay_cap_nhat ON public.hoa_don;
DROP TRIGGER IF EXISTS trg_goi_y_thuoc_ngay_cap_nhat ON public.goi_y_thuoc;
DROP TRIGGER IF EXISTS trg_don_thuoc_ngay_cap_nhat ON public.don_thuoc;
DROP TRIGGER IF EXISTS trg_danh_muc_ten_benh_ngay_cap_nhat ON public.danh_muc_ten_benh;
DROP TRIGGER IF EXISTS trg_chuyen_khoa_ngay_cap_nhat ON public.chuyen_khoa;
DROP TRIGGER IF EXISTS trg_benh_nhan_ngay_cap_nhat ON public.benh_nhan;
DROP TRIGGER IF EXISTS trg_bac_si_ngay_cap_nhat ON public.bac_si;
DROP INDEX IF EXISTS public.uq_lich_hen_bac_si_khung_gio;
DROP INDEX IF EXISTS public.uq_giao_dich_xuat_don_thuoc;
DROP INDEX IF EXISTS public.uq_chan_doan_chinh;
DROP INDEX IF EXISTS public.uq_bac_si_chuyen_khoa_chinh;
DROP INDEX IF EXISTS public.idx_thuoc_ten_thuoc;
DROP INDEX IF EXISTS public.idx_thong_bao_tai_khoan;
DROP INDEX IF EXISTS public.idx_thong_bao_lich_hen;
DROP INDEX IF EXISTS public.idx_thanh_toan_hoa_don;
DROP INDEX IF EXISTS public.idx_phieu_kham_ngay;
DROP INDEX IF EXISTS public.idx_lich_lam_viec_bs_ngay;
DROP INDEX IF EXISTS public.idx_lich_hen_trang_thai;
DROP INDEX IF EXISTS public.idx_lich_hen_ngay_gio;
DROP INDEX IF EXISTS public.idx_lich_hen_benh_nhan;
DROP INDEX IF EXISTS public.idx_lich_hen_bac_si;
DROP INDEX IF EXISTS public.idx_hoa_don_ngay;
DROP INDEX IF EXISTS public.idx_giao_dich_thuoc;
DROP INDEX IF EXISTS public.idx_don_thuoc_ngay;
DROP INDEX IF EXISTS public.idx_chan_doan_phieu;
DROP INDEX IF EXISTS public.idx_benh_nhan_ho_ten;
DROP INDEX IF EXISTS public.idx_bac_si_ho_ten;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS uq_phieu_kham_id_bn_bs;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS uq_phieu_kham_id_bn;
ALTER TABLE IF EXISTS ONLY public.lich_hen DROP CONSTRAINT IF EXISTS uq_lich_hen_id_bs_bn;
ALTER TABLE IF EXISTS ONLY public.goi_y_thuoc DROP CONSTRAINT IF EXISTS uq_goi_y_benh_thuoc;
ALTER TABLE IF EXISTS ONLY public.chi_tiet_don_thuoc DROP CONSTRAINT IF EXISTS uq_ctdt_don_thuoc_thuoc;
ALTER TABLE IF EXISTS ONLY public.tiep_nhan_benh_nhan DROP CONSTRAINT IF EXISTS tiep_nhan_benh_nhan_pkey;
ALTER TABLE IF EXISTS ONLY public.tiep_nhan_benh_nhan DROP CONSTRAINT IF EXISTS tiep_nhan_benh_nhan_id_lich_hen_key;
ALTER TABLE IF EXISTS ONLY public.tien_su_benh DROP CONSTRAINT IF EXISTS tien_su_benh_pkey;
ALTER TABLE IF EXISTS ONLY public.thuoc DROP CONSTRAINT IF EXISTS thuoc_pkey;
ALTER TABLE IF EXISTS ONLY public.thong_bao DROP CONSTRAINT IF EXISTS thong_bao_pkey;
ALTER TABLE IF EXISTS ONLY public.thanh_toan DROP CONSTRAINT IF EXISTS thanh_toan_pkey;
ALTER TABLE IF EXISTS ONLY public.thanh_toan DROP CONSTRAINT IF EXISTS thanh_toan_ma_giao_dich_key;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS tai_khoan_ten_dang_nhap_key;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS tai_khoan_quan_ly_id_key;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS tai_khoan_pkey;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS tai_khoan_benh_nhan_id_key;
ALTER TABLE IF EXISTS ONLY public.tai_khoan DROP CONSTRAINT IF EXISTS tai_khoan_bac_si_id_key;
ALTER TABLE IF EXISTS ONLY public.quan_ly DROP CONSTRAINT IF EXISTS quan_ly_pkey;
ALTER TABLE IF EXISTS ONLY public.quan_ly DROP CONSTRAINT IF EXISTS quan_ly_id_tai_khoan_key;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS phieu_kham_pkey;
ALTER TABLE IF EXISTS ONLY public.phieu_kham DROP CONSTRAINT IF EXISTS phieu_kham_id_lich_hen_key;
ALTER TABLE IF EXISTS ONLY public.nhat_ky_hoat_dong DROP CONSTRAINT IF EXISTS nhat_ky_hoat_dong_pkey;
ALTER TABLE IF EXISTS ONLY public.lich_su_lich_hen DROP CONSTRAINT IF EXISTS lich_su_lich_hen_pkey;
ALTER TABLE IF EXISTS ONLY public.lich_lam_viec DROP CONSTRAINT IF EXISTS lich_lam_viec_pkey;
ALTER TABLE IF EXISTS ONLY public.lich_hen DROP CONSTRAINT IF EXISTS lich_hen_pkey;
ALTER TABLE IF EXISTS ONLY public.hoa_don DROP CONSTRAINT IF EXISTS hoa_don_pkey;
ALTER TABLE IF EXISTS ONLY public.hoa_don DROP CONSTRAINT IF EXISTS hoa_don_id_phieu_kham_key;
ALTER TABLE IF EXISTS ONLY public.goi_y_thuoc DROP CONSTRAINT IF EXISTS goi_y_thuoc_pkey;
ALTER TABLE IF EXISTS ONLY public.giao_dich_kho_thuoc DROP CONSTRAINT IF EXISTS giao_dich_kho_thuoc_pkey;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS don_thuoc_pkey;
ALTER TABLE IF EXISTS ONLY public.don_thuoc DROP CONSTRAINT IF EXISTS don_thuoc_id_phieu_kham_key;
ALTER TABLE IF EXISTS ONLY public.danh_muc_ten_benh DROP CONSTRAINT IF EXISTS danh_muc_ten_benh_ten_benh_key;
ALTER TABLE IF EXISTS ONLY public.danh_muc_ten_benh DROP CONSTRAINT IF EXISTS danh_muc_ten_benh_pkey;
ALTER TABLE IF EXISTS ONLY public.danh_muc_ten_benh DROP CONSTRAINT IF EXISTS danh_muc_ten_benh_ma_benh_key;
ALTER TABLE IF EXISTS ONLY public.chuyen_khoa DROP CONSTRAINT IF EXISTS chuyen_khoa_ten_chuyen_khoa_key;
ALTER TABLE IF EXISTS ONLY public.chuyen_khoa DROP CONSTRAINT IF EXISTS chuyen_khoa_pkey;
ALTER TABLE IF EXISTS ONLY public.chi_tiet_don_thuoc DROP CONSTRAINT IF EXISTS chi_tiet_don_thuoc_pkey;
ALTER TABLE IF EXISTS ONLY public.chi_so_thong_ke DROP CONSTRAINT IF EXISTS chi_so_thong_ke_pkey;
ALTER TABLE IF EXISTS ONLY public.chan_doan DROP CONSTRAINT IF EXISTS chan_doan_pkey;
ALTER TABLE IF EXISTS ONLY public.benh_nhan DROP CONSTRAINT IF EXISTS benh_nhan_pkey;
ALTER TABLE IF EXISTS ONLY public.benh_nhan DROP CONSTRAINT IF EXISTS benh_nhan_id_tai_khoan_key;
ALTER TABLE IF EXISTS ONLY public.bac_si DROP CONSTRAINT IF EXISTS bac_si_so_chung_chi_hanh_nghe_key;
ALTER TABLE IF EXISTS ONLY public.bac_si DROP CONSTRAINT IF EXISTS bac_si_pkey;
ALTER TABLE IF EXISTS ONLY public.bac_si DROP CONSTRAINT IF EXISTS bac_si_id_tai_khoan_key;
ALTER TABLE IF EXISTS ONLY public.bac_si_chuyen_khoa DROP CONSTRAINT IF EXISTS bac_si_chuyen_khoa_pkey;
ALTER TABLE IF EXISTS ONLY public.bac_si_chuyen_khoa DROP CONSTRAINT IF EXISTS bac_si_chuyen_khoa_id_key;
DROP TABLE IF EXISTS public.tiep_nhan_benh_nhan;
DROP TABLE IF EXISTS public.tien_su_benh;
DROP TABLE IF EXISTS public.thuoc;
DROP TABLE IF EXISTS public.thong_bao;
DROP TABLE IF EXISTS public.thanh_toan;
DROP TABLE IF EXISTS public.tai_khoan;
DROP TABLE IF EXISTS public.quan_ly;
DROP TABLE IF EXISTS public.phieu_kham;
DROP TABLE IF EXISTS public.nhat_ky_hoat_dong;
DROP TABLE IF EXISTS public.lich_su_lich_hen;
DROP TABLE IF EXISTS public.lich_lam_viec;
DROP TABLE IF EXISTS public.lich_hen;
DROP TABLE IF EXISTS public.hoa_don;
DROP TABLE IF EXISTS public.goi_y_thuoc;
DROP TABLE IF EXISTS public.giao_dich_kho_thuoc;
DROP TABLE IF EXISTS public.don_thuoc;
DROP TABLE IF EXISTS public.danh_muc_ten_benh;
DROP TABLE IF EXISTS public.chuyen_khoa;
DROP TABLE IF EXISTS public.chi_tiet_don_thuoc;
DROP TABLE IF EXISTS public.chi_so_thong_ke;
DROP TABLE IF EXISTS public.chan_doan;
DROP TABLE IF EXISTS public.benh_nhan;
DROP TABLE IF EXISTS public.bac_si_chuyen_khoa;
DROP TABLE IF EXISTS public.bac_si;
DROP FUNCTION IF EXISTS public.fn_set_ngay_cap_nhat();
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: fn_set_ngay_cap_nhat(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_set_ngay_cap_nhat() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.ngay_cap_nhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bac_si; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bac_si (
    id bigint NOT NULL,
    tai_khoan_id uuid,
    ho_ten character varying(150) NOT NULL,
    ngay_sinh date,
    gioi_tinh character varying(20),
    so_dien_thoai character varying(20),
    email character varying(150),
    bang_cap character varying(255),
    so_chung_chi_hanh_nghe character varying(100),
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: bac_si_chuyen_khoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bac_si_chuyen_khoa (
    bac_si_id bigint NOT NULL,
    chuyen_khoa_id bigint NOT NULL,
    la_chuyen_khoa_chinh boolean DEFAULT false NOT NULL,
    ngay_gan timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id bigint NOT NULL
);


--
-- Name: bac_si_chuyen_khoa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bac_si_chuyen_khoa ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.bac_si_chuyen_khoa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bac_si_id_bac_si_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bac_si ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.bac_si_id_bac_si_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: benh_nhan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.benh_nhan (
    id bigint NOT NULL,
    tai_khoan_id uuid,
    ho_ten character varying(150) NOT NULL,
    ngay_sinh date,
    gioi_tinh character varying(20),
    so_dien_thoai character varying(20),
    email character varying(150),
    dia_chi character varying(255),
    so_bao_hiem_y_te character varying(50),
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: benh_nhan_id_benh_nhan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.benh_nhan ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.benh_nhan_id_benh_nhan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chan_doan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chan_doan (
    id bigint NOT NULL,
    phieu_kham_id bigint NOT NULL,
    benh_id bigint NOT NULL,
    la_chan_doan_chinh boolean DEFAULT false NOT NULL,
    ghi_chu text,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: chan_doan_id_chan_doan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.chan_doan ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.chan_doan_id_chan_doan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chi_so_thong_ke; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chi_so_thong_ke (
    id bigint NOT NULL,
    loai_chi_so character varying(100) NOT NULL,
    du_lieu_thong_ke jsonb NOT NULL,
    thoi_gian_tinh timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: chi_so_thong_ke_id_chi_so_thong_ke_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.chi_so_thong_ke ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.chi_so_thong_ke_id_chi_so_thong_ke_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chi_tiet_don_thuoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chi_tiet_don_thuoc (
    id bigint NOT NULL,
    don_thuoc_id bigint NOT NULL,
    thuoc_id bigint NOT NULL,
    so_luong integer NOT NULL,
    lieu_dung character varying(255),
    tan_suat character varying(100),
    so_ngay_dung integer,
    duong_dung character varying(100),
    huong_dan text,
    don_gia_tai_thoi_diem_ke numeric(12,2) DEFAULT 0 NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_ctdt_don_gia CHECK ((don_gia_tai_thoi_diem_ke >= (0)::numeric)),
    CONSTRAINT chk_ctdt_so_luong CHECK ((so_luong > 0)),
    CONSTRAINT chk_ctdt_so_ngay CHECK (((so_ngay_dung IS NULL) OR (so_ngay_dung > 0)))
);


--
-- Name: chi_tiet_don_thuoc_id_chi_tiet_don_thuoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.chi_tiet_don_thuoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.chi_tiet_don_thuoc_id_chi_tiet_don_thuoc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chuyen_khoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chuyen_khoa (
    id bigint NOT NULL,
    ten_chuyen_khoa character varying(150) NOT NULL,
    mo_ta text,
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: chuyen_khoa_id_chuyen_khoa_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.chuyen_khoa ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.chuyen_khoa_id_chuyen_khoa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: danh_muc_ten_benh; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.danh_muc_ten_benh (
    id bigint NOT NULL,
    ma_benh character varying(50) NOT NULL,
    ten_benh character varying(255) NOT NULL,
    mo_ta text,
    nhom_benh character varying(100),
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: danh_muc_ten_benh_id_danh_muc_ten_benh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.danh_muc_ten_benh ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.danh_muc_ten_benh_id_danh_muc_ten_benh_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: don_thuoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.don_thuoc (
    id bigint NOT NULL,
    phieu_kham_id bigint NOT NULL,
    benh_nhan_id bigint NOT NULL,
    bac_si_id bigint NOT NULL,
    ngay_ke_don date NOT NULL,
    ghi_chu text,
    trang_thai character varying(30) DEFAULT 'Da ke'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: don_thuoc_id_don_thuoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.don_thuoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.don_thuoc_id_don_thuoc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: giao_dich_kho_thuoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.giao_dich_kho_thuoc (
    id bigint NOT NULL,
    thuoc_id bigint NOT NULL,
    loai_giao_dich character varying(50) NOT NULL,
    so_luong integer NOT NULL,
    tham_chieu_id bigint,
    ghi_chu text,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_giao_dich_loai CHECK (((loai_giao_dich)::text = ANY ((ARRAY['NHAP_KHO'::character varying, 'XUAT_DON_THUOC'::character varying])::text[]))),
    CONSTRAINT chk_giao_dich_so_luong CHECK ((so_luong > 0)),
    CONSTRAINT chk_giao_dich_tham_chieu CHECK (((((loai_giao_dich)::text = 'NHAP_KHO'::text) AND (tham_chieu_id IS NULL)) OR (((loai_giao_dich)::text = 'XUAT_DON_THUOC'::text) AND (tham_chieu_id IS NOT NULL))))
);


--
-- Name: giao_dich_kho_thuoc_id_giao_dich_kho_thuoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.giao_dich_kho_thuoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.giao_dich_kho_thuoc_id_giao_dich_kho_thuoc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: goi_y_thuoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.goi_y_thuoc (
    id bigint NOT NULL,
    benh_id bigint NOT NULL,
    thuoc_id bigint NOT NULL,
    muc_do_uu_tien integer DEFAULT 1 NOT NULL,
    muc_dich_su_dung character varying(255),
    lieu_dung_goi_y character varying(255),
    ghi_chu text,
    dang_hoat_dong boolean DEFAULT true NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_goi_y_uu_tien CHECK ((muc_do_uu_tien > 0))
);


--
-- Name: goi_y_thuoc_id_goi_y_thuoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.goi_y_thuoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.goi_y_thuoc_id_goi_y_thuoc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hoa_don; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hoa_don (
    id character varying(30) NOT NULL,
    phieu_kham_id bigint NOT NULL,
    benh_nhan_id bigint NOT NULL,
    ngay_lap date NOT NULL,
    chi_phi_kham numeric(12,2) DEFAULT 0 NOT NULL,
    tien_thuoc numeric(12,2) DEFAULT 0 NOT NULL,
    tong_tien numeric(12,2) DEFAULT 0 NOT NULL,
    trang_thai_thanh_toan character varying(50) DEFAULT 'Chua thanh toan'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phuong_thuc_thanh_toan character varying(50) DEFAULT 'Tien mat'::character varying NOT NULL,
    thoi_gian_thanh_toan timestamp with time zone,
    CONSTRAINT chk_hoa_don_phi_kham CHECK ((chi_phi_kham >= (0)::numeric)),
    CONSTRAINT chk_hoa_don_tien_thuoc CHECK ((tien_thuoc >= (0)::numeric)),
    CONSTRAINT chk_hoa_don_tong_khop CHECK ((tong_tien = (chi_phi_kham + tien_thuoc))),
    CONSTRAINT chk_hoa_don_tong_tien CHECK ((tong_tien >= (0)::numeric)),
    CONSTRAINT chk_hoa_don_trang_thai CHECK (((trang_thai_thanh_toan)::text = ANY ((ARRAY['Chua thanh toan'::character varying, 'Thanh toan mot phan'::character varying, 'Da thanh toan'::character varying])::text[])))
);


--
-- Name: lich_hen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lich_hen (
    id bigint NOT NULL,
    benh_nhan_id bigint NOT NULL,
    bac_si_id bigint NOT NULL,
    ngay_hen date NOT NULL,
    gio_hen time without time zone NOT NULL,
    ly_do_kham text,
    trang_thai character varying(50) NOT NULL,
    nguon_dat_lich character varying(50),
    ghi_chu text,
    ly_do_huy text,
    thoi_gian_huy timestamp with time zone,
    thoi_gian_check_in timestamp with time zone,
    thoi_gian_bat_dau_kham timestamp with time zone,
    thoi_gian_ket_thuc_kham timestamp with time zone,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_lich_hen_trang_thai CHECK (((trang_thai)::text = ANY ((ARRAY['Cho xac nhan'::character varying, 'Da xac nhan'::character varying, 'Da check-in'::character varying, 'Dang kham'::character varying, 'Hoan thanh'::character varying, 'Huy'::character varying])::text[])))
);


--
-- Name: lich_hen_id_lich_hen_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lich_hen ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lich_hen_id_lich_hen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lich_lam_viec; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lich_lam_viec (
    id bigint NOT NULL,
    bac_si_id bigint NOT NULL,
    ngay_lam_viec date NOT NULL,
    gio_bat_dau time without time zone NOT NULL,
    gio_ket_thuc time without time zone NOT NULL,
    thoi_luong_moi_ca integer DEFAULT 30 NOT NULL,
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ghi_chu text,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_lich_lam_viec_ca CHECK ((thoi_luong_moi_ca > 0)),
    CONSTRAINT chk_lich_lam_viec_gio CHECK ((gio_ket_thuc > gio_bat_dau))
);


--
-- Name: lich_lam_viec_id_lich_lam_viec_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lich_lam_viec ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lich_lam_viec_id_lich_lam_viec_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lich_su_lich_hen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lich_su_lich_hen (
    id bigint NOT NULL,
    lich_hen_id bigint NOT NULL,
    ngay_cu date,
    gio_cu time without time zone,
    ngay_moi date,
    gio_moi time without time zone,
    trang_thai_cu character varying(50),
    trang_thai_moi character varying(50),
    loai_thay_doi character varying(50) NOT NULL,
    ly_do text,
    nguoi_thay_doi uuid,
    thoi_gian_thay_doi timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: lich_su_lich_hen_id_lich_su_lich_hen_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lich_su_lich_hen ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lich_su_lich_hen_id_lich_su_lich_hen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: nhat_ky_hoat_dong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nhat_ky_hoat_dong (
    id bigint NOT NULL,
    tai_khoan_id uuid,
    hanh_dong character varying(100) NOT NULL,
    loai_doi_tuong character varying(100),
    doi_tuong_id character varying(100),
    du_lieu_cu jsonb,
    du_lieu_moi jsonb,
    thoi_gian timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: nhat_ky_hoat_dong_id_nhat_ky_hoat_dong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.nhat_ky_hoat_dong ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.nhat_ky_hoat_dong_id_nhat_ky_hoat_dong_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: phieu_kham; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phieu_kham (
    id bigint NOT NULL,
    lich_hen_id bigint NOT NULL,
    benh_nhan_id bigint NOT NULL,
    bac_si_id bigint NOT NULL,
    ngay_kham date NOT NULL,
    trieu_chung text,
    ket_qua_kham text,
    ket_luan text,
    huong_dieu_tri text,
    ghi_chu_bac_si text,
    ngay_tai_kham date,
    chi_phi_kham numeric(12,2) DEFAULT 0 NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_phieu_kham_phi CHECK ((chi_phi_kham >= (0)::numeric))
);


--
-- Name: phieu_kham_id_phieu_kham_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.phieu_kham ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.phieu_kham_id_phieu_kham_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quan_ly; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quan_ly (
    id bigint NOT NULL,
    tai_khoan_id uuid,
    ho_ten character varying(150) NOT NULL,
    so_dien_thoai character varying(20),
    email character varying(150)
);


--
-- Name: quan_ly_id_quan_ly_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.quan_ly ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.quan_ly_id_quan_ly_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tai_khoan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tai_khoan (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ten_dang_nhap character varying(100) NOT NULL,
    mat_khau_ma_hoa character varying(255) NOT NULL,
    vai_tro character varying(50) NOT NULL,
    trang_thai character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    quan_ly_id bigint,
    bac_si_id bigint,
    benh_nhan_id bigint,
    CONSTRAINT chk_tai_khoan_trang_thai CHECK (((trang_thai)::text = ANY ((ARRAY['Active'::character varying, 'Inactive'::character varying, 'Locked'::character varying])::text[]))),
    CONSTRAINT chk_tai_khoan_vai_tro CHECK (((vai_tro)::text = ANY ((ARRAY['Admin'::character varying, 'BacSi'::character varying, 'NguoiDung'::character varying])::text[])))
);


--
-- Name: thanh_toan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.thanh_toan (
    id bigint NOT NULL,
    hoa_don_id character varying(30) NOT NULL,
    so_tien numeric(12,2) NOT NULL,
    phuong_thuc_thanh_toan character varying(50) NOT NULL,
    ma_giao_dich character varying(100),
    trang_thai character varying(30) NOT NULL,
    thoi_gian_thanh_toan timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_thanh_toan_so_tien CHECK ((so_tien > (0)::numeric)),
    CONSTRAINT chk_thanh_toan_trang_thai CHECK (((trang_thai)::text = ANY ((ARRAY['Thanh cong'::character varying, 'That bai'::character varying, 'Hoan tien'::character varying])::text[])))
);


--
-- Name: thanh_toan_id_thanh_toan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.thanh_toan ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.thanh_toan_id_thanh_toan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: thong_bao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.thong_bao (
    id bigint NOT NULL,
    tai_khoan_id uuid,
    lich_hen_id bigint,
    loai character varying(50) NOT NULL,
    kenh character varying(30),
    tieu_de character varying(255) NOT NULL,
    noi_dung text NOT NULL,
    trang_thai character varying(30) NOT NULL,
    thoi_gian_du_kien_gui timestamp with time zone,
    thoi_gian_gui timestamp with time zone,
    thoi_gian_doc timestamp with time zone,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: thong_bao_id_thong_bao_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.thong_bao ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.thong_bao_id_thong_bao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: thuoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.thuoc (
    id bigint NOT NULL,
    ten_thuoc character varying(255) NOT NULL,
    hoat_chat character varying(255),
    ham_luong character varying(100),
    don_vi character varying(50),
    don_gia numeric(12,2) DEFAULT 0 NOT NULL,
    so_luong_ton integer DEFAULT 0 NOT NULL,
    han_su_dung date,
    nha_san_xuat character varying(255),
    dang_hoat_dong boolean DEFAULT true NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ngay_cap_nhat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_thuoc_don_gia CHECK ((don_gia >= (0)::numeric)),
    CONSTRAINT chk_thuoc_ton CHECK ((so_luong_ton >= 0))
);


--
-- Name: thuoc_id_thuoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.thuoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.thuoc_id_thuoc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tien_su_benh; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tien_su_benh (
    id bigint NOT NULL,
    benh_nhan_id bigint NOT NULL,
    loai_tien_su character varying(100) NOT NULL,
    mo_ta text,
    ngay_phat_hien date,
    ghi_chu text,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tien_su_benh_id_tien_su_benh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tien_su_benh ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tien_su_benh_id_tien_su_benh_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tiep_nhan_benh_nhan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tiep_nhan_benh_nhan (
    id bigint NOT NULL,
    lich_hen_id bigint NOT NULL,
    can_nang numeric(5,2),
    chieu_cao numeric(5,2),
    nhiet_do numeric(4,1),
    huyet_ap_tam_thu integer,
    huyet_ap_tam_truong integer,
    nhip_tim integer,
    spo2 numeric(5,2),
    trieu_chung_ban_dau text,
    ghi_chu text,
    thoi_gian_ghi_nhan timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_tiep_nhan_can_nang CHECK (((can_nang IS NULL) OR (can_nang > (0)::numeric))),
    CONSTRAINT chk_tiep_nhan_chieu_cao CHECK (((chieu_cao IS NULL) OR (chieu_cao > (0)::numeric))),
    CONSTRAINT chk_tiep_nhan_spo2 CHECK (((spo2 IS NULL) OR ((spo2 >= (0)::numeric) AND (spo2 <= (100)::numeric))))
);


--
-- Name: tiep_nhan_benh_nhan_id_tiep_nhan_benh_nhan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tiep_nhan_benh_nhan ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tiep_nhan_benh_nhan_id_tiep_nhan_benh_nhan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: bac_si; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bac_si (id, tai_khoan_id, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, bang_cap, so_chung_chi_hanh_nghe, trang_thai, ngay_tao, ngay_cap_nhat) FROM stdin;
1	00000000-0000-0000-0000-000000000101	Nguyen Van A	1981-02-11	Nam	09011111111	bs1@qlphongkham.local	Bac si	CCHN-BS001	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
2	00000000-0000-0000-0000-000000000102	Tran Thi B	1982-03-12	Nu	09022222222	bs2@qlphongkham.local	Bac si	CCHN-BS002	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
3	00000000-0000-0000-0000-000000000103	Le Quang C	1983-04-13	Nam	09033333333	bs3@qlphongkham.local	Bac si	CCHN-BS003	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
4	00000000-0000-0000-0000-000000000104	Pham Thu D	1984-05-14	Nu	09044444444	bs4@qlphongkham.local	Bac si	CCHN-BS004	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
5	00000000-0000-0000-0000-000000000105	Hoang Minh E	1985-06-15	Nam	09055555555	bs5@qlphongkham.local	Bac si	CCHN-BS005	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
\.


--
-- Data for Name: bac_si_chuyen_khoa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bac_si_chuyen_khoa (bac_si_id, chuyen_khoa_id, la_chuyen_khoa_chinh, ngay_gan, id) FROM stdin;
1	1	t	2026-01-01 01:00:00+00	1
2	2	t	2026-01-01 01:00:00+00	2
3	3	t	2026-01-01 01:00:00+00	3
4	4	t	2026-01-01 01:00:00+00	4
5	1	t	2026-01-01 01:00:00+00	5
\.


--
-- Data for Name: benh_nhan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.benh_nhan (id, tai_khoan_id, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, so_bao_hiem_y_te, trang_thai, ngay_tao, ngay_cap_nhat) FROM stdin;
1	00000000-0000-0000-0000-000000001001	Pham Van Phuong	1987-04-08	Nam	0918196001	bn1@example.com	TP HCM	BHYT00000001	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
2	00000000-0000-0000-0000-000000001002	Nguyen Tuan Hieu	2004-07-08	Nu	0994026542	bn2@example.com	TP HCM	BHYT00000002	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
3	00000000-0000-0000-0000-000000001003	Pham Thi Nam	1976-06-28	Nu	0994078161	bn3@example.com	Can Tho	BHYT00000003	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
4	00000000-0000-0000-0000-000000001004	Ly Thu Hieu	1974-01-22	Nam	0941316475	bn4@example.com	TP HCM	BHYT00000004	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
5	00000000-0000-0000-0000-000000001005	Ly Minh Vy	1987-12-22	Nam	0992832764	bn5@example.com	Bac Ninh	BHYT00000005	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
6	00000000-0000-0000-0000-000000001006	Bui Anh Ly	1973-04-27	Nam	0956413953	bn6@example.com	Bac Ninh	BHYT00000006	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
7	00000000-0000-0000-0000-000000001007	Mai Hong Dieu	1999-03-09	Nam	0938849696	bn7@example.com	Da Nang	BHYT00000007	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
8	00000000-0000-0000-0000-000000001008	Hoang Tuan Ngoc	1975-01-28	Nam	0922691669	bn8@example.com	Hai Phong	BHYT00000008	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
9	00000000-0000-0000-0000-000000001009	Dang Tuan Thao	1970-11-24	Nam	0984514627	bn9@example.com	Ha Noi	BHYT00000009	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
10	00000000-0000-0000-0000-000000001010	Dang Tuan Minh	1981-09-04	Nu	0989325288	bn10@example.com	Ha Noi	BHYT00000010	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
11	00000000-0000-0000-0000-000000001011	Duong Ngoc An	1977-06-27	Nu	0930391171	bn11@example.com	Can Tho	BHYT00000011	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
12	00000000-0000-0000-0000-000000001012	Hoang Anh Ngoc	2005-03-09	Nu	0938346578	bn12@example.com	Hai Phong	BHYT00000012	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
13	00000000-0000-0000-0000-000000001013	Bui Minh Chi	1991-01-19	Nam	0993010310	bn13@example.com	Da Nang	BHYT00000013	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
14	00000000-0000-0000-0000-000000001014	Bui Quoc Vy	2001-04-18	Nam	0999737631	bn14@example.com	Ha Noi	BHYT00000014	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
15	00000000-0000-0000-0000-000000001015	Ton Thanh Ngan	1996-08-28	Nam	0910651333	bn15@example.com	Can Tho	BHYT00000015	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
16	00000000-0000-0000-0000-000000001016	Hoang Duc Hanh	1987-08-08	Nam	0978108013	bn16@example.com	TP HCM	BHYT00000016	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
17	00000000-0000-0000-0000-000000001017	Ha Ngoc Hieu	1995-01-06	Nu	0906474687	bn17@example.com	TP HCM	BHYT00000017	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
18	00000000-0000-0000-0000-000000001018	Ngo Minh Binh	2007-12-18	Nam	0950097882	bn18@example.com	Ha Noi	BHYT00000018	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
19	00000000-0000-0000-0000-000000001019	Le Khanh Hanh	1974-10-03	Nam	0961939909	bn19@example.com	Ha Noi	BHYT00000019	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
20	00000000-0000-0000-0000-000000001020	Duong Hong Lan	1983-11-23	Nu	0934624751	bn20@example.com	Ha Noi	BHYT00000020	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
21	00000000-0000-0000-0000-000000001021	Pham Thi Quang	1983-09-09	Nam	0951354278	bn21@example.com	Bac Ninh	BHYT00000021	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
22	00000000-0000-0000-0000-000000001022	Nguyen Anh Toan	2005-05-22	Nam	0924118244	bn22@example.com	Can Tho	BHYT00000022	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
23	00000000-0000-0000-0000-000000001023	Duong Minh Vy	1986-09-16	Nu	0901640052	bn23@example.com	Bac Ninh	BHYT00000023	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
24	00000000-0000-0000-0000-000000001024	Vu Bao Nga	2005-12-14	Nam	0911280598	bn24@example.com	TP HCM	BHYT00000024	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
25	00000000-0000-0000-0000-000000001025	Hoang Van Linh	1993-01-12	Nam	0931586923	bn25@example.com	TP HCM	BHYT00000025	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
26	00000000-0000-0000-0000-000000001026	Ton Van Hanh	1991-07-26	Nam	0942160733	bn26@example.com	Hai Phong	BHYT00000026	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
27	00000000-0000-0000-0000-000000001027	Ngo Khanh Nhan	1984-04-01	Nam	0965414586	bn27@example.com	Bac Ninh	BHYT00000027	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
28	00000000-0000-0000-0000-000000001028	Duong Van Dung	1986-03-19	Nu	0901965569	bn28@example.com	Can Tho	BHYT00000028	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
29	00000000-0000-0000-0000-000000001029	Mai Hong Son	1982-05-02	Nu	0908835615	bn29@example.com	Can Tho	BHYT00000029	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
30	00000000-0000-0000-0000-000000001030	Pham Bao Tam	1989-09-10	Nu	0956482366	bn30@example.com	Bac Ninh	BHYT00000030	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
31	00000000-0000-0000-0000-000000001031	Vu Thu Son	1989-07-18	Nam	0944369957	bn31@example.com	Hai Phong	BHYT00000031	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
32	00000000-0000-0000-0000-000000001032	Do Tuan Ngoc	1980-11-03	Nu	0989513433	bn32@example.com	TP HCM	BHYT00000032	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
33	00000000-0000-0000-0000-000000001033	Tran Minh Ngoc	1974-08-14	Nam	0967632016	bn33@example.com	TP HCM	BHYT00000033	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
34	00000000-0000-0000-0000-000000001034	Chu Van Quang	1985-02-15	Nam	0978895798	bn34@example.com	Hai Phong	BHYT00000034	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
35	00000000-0000-0000-0000-000000001035	Chu Hong Hanh	2000-08-09	Nam	0948734714	bn35@example.com	TP HCM	BHYT00000035	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
36	00000000-0000-0000-0000-000000001036	Duong Thanh Tam	2004-02-05	Nam	0936231665	bn36@example.com	Can Tho	BHYT00000036	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
37	00000000-0000-0000-0000-000000001037	Ton Van Hieu	1996-07-25	Nam	0996705466	bn37@example.com	Can Tho	BHYT00000037	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
38	00000000-0000-0000-0000-000000001038	Bui Ngoc Khang	1987-07-16	Nam	0965627298	bn38@example.com	Ha Noi	BHYT00000038	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
39	00000000-0000-0000-0000-000000001039	Nguyen Thi Tuan	1997-03-28	Nu	0920465375	bn39@example.com	Da Nang	BHYT00000039	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
40	00000000-0000-0000-0000-000000001040	Dang Gia Toan	1996-05-27	Nam	0970805310	bn40@example.com	Ha Noi	BHYT00000040	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
41	00000000-0000-0000-0000-000000001041	Do Khanh An	1979-04-05	Nu	0919374529	bn41@example.com	Can Tho	BHYT00000041	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
42	00000000-0000-0000-0000-000000001042	Pham Gia Toan	1980-05-04	Nam	0949663193	bn42@example.com	Ha Noi	BHYT00000042	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
43	00000000-0000-0000-0000-000000001043	Ngo Khanh Vy	2008-02-26	Nam	0958651850	bn43@example.com	Hai Phong	BHYT00000043	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
44	00000000-0000-0000-0000-000000001044	Pham Duc Mai	1999-12-05	Nu	0928498776	bn44@example.com	Bac Ninh	BHYT00000044	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
45	00000000-0000-0000-0000-000000001045	Dang Thanh Thao	1985-02-09	Nu	0937996507	bn45@example.com	Da Nang	BHYT00000045	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
46	00000000-0000-0000-0000-000000001046	Ha Minh Mai	1986-06-09	Nu	0980831367	bn46@example.com	Can Tho	BHYT00000046	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
47	00000000-0000-0000-0000-000000001047	Ha Anh Yen	2001-08-26	Nam	0914363495	bn47@example.com	Hai Phong	BHYT00000047	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
48	00000000-0000-0000-0000-000000001048	Ly Duc Phuong	2005-06-12	Nu	0944431351	bn48@example.com	Bac Ninh	BHYT00000048	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
49	00000000-0000-0000-0000-000000001049	Vu Minh Hieu	2000-05-24	Nu	0913435240	bn49@example.com	Bac Ninh	BHYT00000049	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
50	00000000-0000-0000-0000-000000001050	Hoang Quoc Binh	1973-09-10	Nam	0971094777	bn50@example.com	Da Nang	BHYT00000050	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
\.


--
-- Data for Name: chan_doan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chan_doan (id, phieu_kham_id, benh_id, la_chan_doan_chinh, ghi_chu, ngay_tao) FROM stdin;
1	1	1	t	\N	2026-02-14 17:00:00+00
2	2	2	t	\N	2026-01-06 17:00:00+00
3	3	3	t	\N	2026-03-01 17:00:00+00
4	4	4	t	\N	2026-02-26 17:00:00+00
5	5	2	t	\N	2026-02-07 17:00:00+00
6	6	5	t	\N	2026-01-10 17:00:00+00
7	7	3	t	\N	2026-03-20 17:00:00+00
8	8	6	t	\N	2026-02-06 17:00:00+00
9	9	6	t	\N	2026-04-19 17:00:00+00
10	10	1	t	\N	2026-02-21 17:00:00+00
11	11	5	t	\N	2026-01-19 17:00:00+00
12	12	1	t	\N	2026-02-14 17:00:00+00
13	13	1	t	\N	2026-02-14 17:00:00+00
14	14	3	t	\N	2026-04-08 17:00:00+00
15	15	7	t	\N	2026-02-12 17:00:00+00
16	16	2	t	\N	2026-03-25 17:00:00+00
17	17	2	t	\N	2026-01-11 17:00:00+00
18	18	3	t	\N	2026-02-12 17:00:00+00
19	19	7	t	\N	2026-02-25 17:00:00+00
20	20	3	t	\N	2026-02-03 17:00:00+00
21	21	1	t	\N	2026-02-05 17:00:00+00
22	22	8	t	\N	2026-01-05 17:00:00+00
23	23	8	t	\N	2026-02-06 17:00:00+00
24	24	4	t	\N	2026-01-22 17:00:00+00
25	25	8	t	\N	2026-03-05 17:00:00+00
26	26	7	t	\N	2026-02-06 17:00:00+00
27	27	6	t	\N	2026-01-11 17:00:00+00
28	28	3	t	\N	2026-02-20 17:00:00+00
29	29	1	t	\N	2026-01-28 17:00:00+00
30	30	5	t	\N	2026-02-13 17:00:00+00
31	31	2	t	\N	2026-01-19 17:00:00+00
32	32	2	t	\N	2026-04-11 17:00:00+00
33	33	2	t	\N	2026-02-08 17:00:00+00
34	34	2	t	\N	2026-03-17 17:00:00+00
35	35	2	t	\N	2026-02-10 17:00:00+00
36	36	3	t	\N	2026-03-23 17:00:00+00
37	37	4	t	\N	2026-02-25 17:00:00+00
38	38	8	t	\N	2026-04-11 17:00:00+00
39	39	6	t	\N	2026-03-27 17:00:00+00
40	40	2	t	\N	2026-04-21 17:00:00+00
41	41	4	t	\N	2026-02-13 17:00:00+00
42	42	5	t	\N	2026-03-06 17:00:00+00
43	43	5	t	\N	2026-01-27 17:00:00+00
44	44	6	t	\N	2026-01-16 17:00:00+00
45	45	4	t	\N	2026-02-21 17:00:00+00
46	46	8	t	\N	2026-04-06 17:00:00+00
47	47	5	t	\N	2026-04-13 17:00:00+00
48	48	7	t	\N	2026-03-11 17:00:00+00
49	49	3	t	\N	2026-01-06 17:00:00+00
50	50	7	t	\N	2026-02-16 17:00:00+00
51	51	6	t	\N	2026-04-11 17:00:00+00
52	52	6	t	\N	2026-03-30 17:00:00+00
53	53	2	t	\N	2026-01-10 17:00:00+00
54	54	3	t	\N	2026-04-03 17:00:00+00
55	55	7	t	\N	2026-01-30 17:00:00+00
56	56	1	t	\N	2026-03-22 17:00:00+00
57	57	2	t	\N	2026-01-30 17:00:00+00
58	58	1	t	\N	2026-02-14 17:00:00+00
59	59	8	t	\N	2026-03-08 17:00:00+00
60	60	1	t	\N	2026-04-10 17:00:00+00
61	61	5	t	\N	2026-03-22 17:00:00+00
62	62	1	t	\N	2026-02-14 17:00:00+00
63	63	2	t	\N	2026-04-08 17:00:00+00
64	64	1	t	\N	2026-04-01 17:00:00+00
65	65	2	t	\N	2026-04-11 17:00:00+00
66	66	7	t	\N	2026-02-19 17:00:00+00
67	67	2	t	\N	2026-02-03 17:00:00+00
68	68	6	t	\N	2026-02-18 17:00:00+00
69	69	8	t	\N	2026-01-10 17:00:00+00
70	70	7	t	\N	2026-02-26 17:00:00+00
71	71	8	t	\N	2026-02-24 17:00:00+00
72	72	1	t	\N	2026-02-15 17:00:00+00
73	73	1	t	\N	2026-03-27 17:00:00+00
74	74	8	t	\N	2026-04-09 17:00:00+00
75	75	4	t	\N	2026-03-18 17:00:00+00
76	76	2	t	\N	2026-04-07 17:00:00+00
77	77	6	t	\N	2026-02-09 17:00:00+00
78	78	6	t	\N	2026-02-02 17:00:00+00
79	79	8	t	\N	2026-03-29 17:00:00+00
80	80	4	t	\N	2026-02-26 17:00:00+00
81	81	5	t	\N	2026-03-26 17:00:00+00
\.


--
-- Data for Name: chi_so_thong_ke; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chi_so_thong_ke (id, loai_chi_so, du_lieu_thong_ke, thoi_gian_tinh) FROM stdin;
1	TONG_BENH_NHAN	{"tongBenhNhan": 50}	2026-04-22 16:59:59+00
2	TONG_BAC_SI	{"tongBacSi": 5}	2026-04-22 16:59:59+00
3	THONG_KE_LICH_HEN	{"Huy": 13, "Hoan thanh": 81, "Da xac nhan": 26}	2026-04-22 16:59:59+00
4	THONG_KE_HOA_DON	{"soHoaDon": 72, "tongDoanhThu": 27641000.0}	2026-04-22 16:59:59+00
\.


--
-- Data for Name: chi_tiet_don_thuoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chi_tiet_don_thuoc (id, don_thuoc_id, thuoc_id, so_luong, lieu_dung, tan_suat, so_ngay_dung, duong_dung, huong_dan, don_gia_tai_thoi_diem_ke, ngay_tao) FROM stdin;
1	1	69	5	Sau an	Theo chi dinh	5	Uong	Sau an	40000.00	2026-02-14 17:00:00+00
2	1	44	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	40000.00	2026-02-14 17:00:00+00
3	1	70	4	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	10000.00	2026-02-14 17:00:00+00
4	1	46	9	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	18000.00	2026-02-14 17:00:00+00
5	2	89	8	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-01-06 17:00:00+00
6	2	91	8	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	5000.00	2026-01-06 17:00:00+00
7	3	51	5	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	7000.00	2026-03-01 17:00:00+00
8	3	45	5	Truoc an	Theo chi dinh	5	Uong	Truoc an	5000.00	2026-03-01 17:00:00+00
9	3	99	2	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	8000.00	2026-03-01 17:00:00+00
10	3	19	8	Truoc an	Theo chi dinh	5	Uong	Truoc an	40000.00	2026-03-01 17:00:00+00
11	4	72	3	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	35000.00	2026-02-26 17:00:00+00
12	4	90	10	Truoc an	Theo chi dinh	5	Uong	Truoc an	7000.00	2026-02-26 17:00:00+00
13	4	35	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	20000.00	2026-02-26 17:00:00+00
14	5	82	1	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	12000.00	2026-02-07 17:00:00+00
15	5	30	7	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-02-07 17:00:00+00
16	6	71	3	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	30000.00	2026-01-10 17:00:00+00
17	7	37	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	20000.00	2026-03-20 17:00:00+00
18	7	83	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	35000.00	2026-03-20 17:00:00+00
19	7	8	9	Truoc an	Theo chi dinh	5	Uong	Truoc an	35000.00	2026-03-20 17:00:00+00
20	8	51	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	7000.00	2026-02-06 17:00:00+00
21	9	43	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	25000.00	2026-04-19 17:00:00+00
22	10	25	3	Truoc an	Theo chi dinh	5	Uong	Truoc an	15000.00	2026-02-21 17:00:00+00
23	10	15	8	Truoc an	Theo chi dinh	5	Uong	Truoc an	7000.00	2026-02-21 17:00:00+00
24	10	43	5	Truoc an	Theo chi dinh	5	Uong	Truoc an	25000.00	2026-02-21 17:00:00+00
25	11	23	7	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	35000.00	2026-01-19 17:00:00+00
26	11	79	9	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-01-19 17:00:00+00
27	12	62	4	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	12000.00	2026-02-14 17:00:00+00
28	12	42	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	20000.00	2026-02-14 17:00:00+00
29	13	75	1	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	40000.00	2026-02-14 17:00:00+00
30	13	93	6	Truoc an	Theo chi dinh	5	Uong	Truoc an	25000.00	2026-02-14 17:00:00+00
31	13	74	4	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	15000.00	2026-02-14 17:00:00+00
32	14	89	5	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-04-08 17:00:00+00
33	14	16	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	30000.00	2026-04-08 17:00:00+00
34	14	82	4	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	12000.00	2026-04-08 17:00:00+00
35	15	54	8	Sau an	Theo chi dinh	5	Uong	Sau an	35000.00	2026-02-12 17:00:00+00
36	15	90	4	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	7000.00	2026-02-12 17:00:00+00
37	15	71	10	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	30000.00	2026-02-12 17:00:00+00
38	16	8	9	Sau an	Theo chi dinh	5	Uong	Sau an	35000.00	2026-03-25 17:00:00+00
39	17	15	10	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	7000.00	2026-01-11 17:00:00+00
40	17	88	2	Sau an	Theo chi dinh	5	Uong	Sau an	15000.00	2026-01-11 17:00:00+00
41	17	27	8	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	15000.00	2026-01-11 17:00:00+00
42	17	92	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	10000.00	2026-01-11 17:00:00+00
43	18	87	7	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	7000.00	2026-02-12 17:00:00+00
44	18	40	1	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-02-12 17:00:00+00
45	18	93	4	Sau an	Theo chi dinh	5	Uong	Sau an	25000.00	2026-02-12 17:00:00+00
46	18	3	2	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	5000.00	2026-02-12 17:00:00+00
47	19	9	8	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	10000.00	2026-02-25 17:00:00+00
48	20	48	9	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	20000.00	2026-02-03 17:00:00+00
49	20	49	6	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	8000.00	2026-02-03 17:00:00+00
50	20	58	3	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-02-03 17:00:00+00
51	20	11	7	Sau an	Theo chi dinh	5	Uong	Sau an	5000.00	2026-02-03 17:00:00+00
52	21	60	9	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	30000.00	2026-02-05 17:00:00+00
53	21	87	9	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	7000.00	2026-02-05 17:00:00+00
54	21	93	4	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-02-05 17:00:00+00
55	22	5	7	Sau an	Theo chi dinh	5	Uong	Sau an	30000.00	2026-01-05 17:00:00+00
56	23	58	10	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-02-06 17:00:00+00
57	24	30	1	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	30000.00	2026-01-22 17:00:00+00
58	24	70	9	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	10000.00	2026-01-22 17:00:00+00
59	24	28	4	Truoc an	Theo chi dinh	5	Uong	Truoc an	25000.00	2026-01-22 17:00:00+00
60	24	97	10	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	25000.00	2026-01-22 17:00:00+00
61	25	53	5	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	25000.00	2026-03-05 17:00:00+00
62	25	39	9	Sau an	Theo chi dinh	5	Uong	Sau an	12000.00	2026-03-05 17:00:00+00
63	26	83	9	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-02-06 17:00:00+00
64	26	86	7	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	8000.00	2026-02-06 17:00:00+00
65	26	49	3	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	8000.00	2026-02-06 17:00:00+00
66	27	29	3	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	20000.00	2026-01-11 17:00:00+00
67	27	39	1	Sau an	Theo chi dinh	5	Uong	Sau an	12000.00	2026-01-11 17:00:00+00
68	28	32	2	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	40000.00	2026-02-20 17:00:00+00
69	28	33	6	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	10000.00	2026-02-20 17:00:00+00
70	28	27	9	Truoc an	Theo chi dinh	5	Uong	Truoc an	15000.00	2026-02-20 17:00:00+00
71	28	43	4	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	25000.00	2026-02-20 17:00:00+00
72	29	10	4	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-01-28 17:00:00+00
73	30	2	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-02-13 17:00:00+00
74	30	28	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-02-13 17:00:00+00
75	30	25	10	Truoc an	Theo chi dinh	5	Uong	Truoc an	15000.00	2026-02-13 17:00:00+00
76	32	60	5	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-04-11 17:00:00+00
77	32	69	6	Sau an	Theo chi dinh	5	Uong	Sau an	40000.00	2026-04-11 17:00:00+00
78	32	84	8	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	15000.00	2026-04-11 17:00:00+00
79	32	46	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-04-11 17:00:00+00
80	34	73	4	Truoc an	Theo chi dinh	5	Uong	Truoc an	35000.00	2026-03-17 17:00:00+00
81	35	38	4	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	10000.00	2026-02-10 17:00:00+00
82	35	20	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	10000.00	2026-02-10 17:00:00+00
83	35	26	8	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-02-10 17:00:00+00
84	35	43	6	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	25000.00	2026-02-10 17:00:00+00
85	36	22	9	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	35000.00	2026-03-23 17:00:00+00
86	36	18	3	Sau an	Theo chi dinh	5	Uong	Sau an	20000.00	2026-03-23 17:00:00+00
87	36	93	1	Sau an	Theo chi dinh	5	Uong	Sau an	25000.00	2026-03-23 17:00:00+00
88	38	18	3	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	20000.00	2026-04-11 17:00:00+00
89	38	81	4	Sau an	Theo chi dinh	5	Uong	Sau an	7000.00	2026-04-11 17:00:00+00
90	38	30	8	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-04-11 17:00:00+00
91	38	9	1	Sau an	Theo chi dinh	5	Uong	Sau an	10000.00	2026-04-11 17:00:00+00
92	39	2	5	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-03-27 17:00:00+00
93	39	3	5	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	5000.00	2026-03-27 17:00:00+00
94	39	68	9	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-03-27 17:00:00+00
95	39	93	7	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-03-27 17:00:00+00
96	40	80	5	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	15000.00	2026-04-21 17:00:00+00
97	40	68	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	18000.00	2026-04-21 17:00:00+00
98	42	39	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-03-06 17:00:00+00
99	42	88	1	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	15000.00	2026-03-06 17:00:00+00
100	43	82	1	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-01-27 17:00:00+00
101	44	73	1	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	35000.00	2026-01-16 17:00:00+00
102	44	13	4	Truoc an	Theo chi dinh	5	Uong	Truoc an	30000.00	2026-01-16 17:00:00+00
103	44	68	10	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	18000.00	2026-01-16 17:00:00+00
104	46	23	6	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	35000.00	2026-04-06 17:00:00+00
105	47	10	4	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-04-13 17:00:00+00
106	47	39	7	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-04-13 17:00:00+00
107	47	21	9	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	12000.00	2026-04-13 17:00:00+00
108	47	73	7	Truoc an	Theo chi dinh	5	Uong	Truoc an	35000.00	2026-04-13 17:00:00+00
109	48	13	7	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	30000.00	2026-03-11 17:00:00+00
110	49	100	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	7000.00	2026-01-06 17:00:00+00
111	49	42	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	20000.00	2026-01-06 17:00:00+00
112	49	4	6	Sau an	Theo chi dinh	5	Uong	Sau an	10000.00	2026-01-06 17:00:00+00
113	49	82	7	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	12000.00	2026-01-06 17:00:00+00
114	50	32	2	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	40000.00	2026-02-16 17:00:00+00
115	50	92	3	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	10000.00	2026-02-16 17:00:00+00
116	50	10	3	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-02-16 17:00:00+00
117	51	40	8	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	12000.00	2026-04-11 17:00:00+00
118	52	58	2	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	18000.00	2026-03-30 17:00:00+00
119	52	72	2	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-03-30 17:00:00+00
120	52	66	9	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	7000.00	2026-03-30 17:00:00+00
121	52	53	10	Sau an	Theo chi dinh	5	Uong	Sau an	25000.00	2026-03-30 17:00:00+00
122	53	100	4	Sau an	Theo chi dinh	5	Uong	Sau an	7000.00	2026-01-10 17:00:00+00
123	53	11	9	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	5000.00	2026-01-10 17:00:00+00
124	53	93	7	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-01-10 17:00:00+00
125	53	72	3	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-01-10 17:00:00+00
126	54	56	7	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	20000.00	2026-04-03 17:00:00+00
127	54	36	8	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	12000.00	2026-04-03 17:00:00+00
128	56	59	3	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-03-22 17:00:00+00
129	56	14	1	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	10000.00	2026-03-22 17:00:00+00
130	57	43	3	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	25000.00	2026-01-30 17:00:00+00
131	57	56	6	Sau an	Theo chi dinh	5	Uong	Sau an	20000.00	2026-01-30 17:00:00+00
132	57	84	4	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	15000.00	2026-01-30 17:00:00+00
133	57	77	6	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	12000.00	2026-01-30 17:00:00+00
134	58	74	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	15000.00	2026-02-14 17:00:00+00
135	58	32	6	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	40000.00	2026-02-14 17:00:00+00
136	58	42	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	20000.00	2026-02-14 17:00:00+00
137	58	49	10	Sau an	Theo chi dinh	5	Uong	Sau an	8000.00	2026-02-14 17:00:00+00
138	60	57	2	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	15000.00	2026-04-10 17:00:00+00
139	60	38	8	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	10000.00	2026-04-10 17:00:00+00
140	61	49	8	Sau an	Theo chi dinh	5	Uong	Sau an	8000.00	2026-03-22 17:00:00+00
141	61	10	7	Sau an	Theo chi dinh	5	Uong	Sau an	18000.00	2026-03-22 17:00:00+00
142	61	58	9	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-03-22 17:00:00+00
143	61	77	7	Sau an	Theo chi dinh	5	Uong	Sau an	12000.00	2026-03-22 17:00:00+00
144	62	14	4	Truoc an	Theo chi dinh	5	Uong	Truoc an	10000.00	2026-02-14 17:00:00+00
145	63	97	1	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	25000.00	2026-04-08 17:00:00+00
146	63	43	5	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-04-08 17:00:00+00
147	63	56	9	Truoc an	Theo chi dinh	5	Uong	Truoc an	20000.00	2026-04-08 17:00:00+00
148	63	14	9	Sau an	Theo chi dinh	5	Uong	Sau an	10000.00	2026-04-08 17:00:00+00
149	64	45	8	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	5000.00	2026-04-01 17:00:00+00
150	64	4	5	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	10000.00	2026-04-01 17:00:00+00
151	65	45	6	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	5000.00	2026-04-11 17:00:00+00
152	65	40	4	Sau an	Theo chi dinh	5	Uong	Sau an	12000.00	2026-04-11 17:00:00+00
153	66	41	2	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	30000.00	2026-02-19 17:00:00+00
154	66	9	6	Truoc an	Theo chi dinh	5	Uong	Truoc an	10000.00	2026-02-19 17:00:00+00
155	66	39	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-02-19 17:00:00+00
156	66	6	3	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-02-19 17:00:00+00
157	67	60	3	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	30000.00	2026-02-03 17:00:00+00
158	67	30	7	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	30000.00	2026-02-03 17:00:00+00
159	67	52	1	Truoc an	Theo chi dinh	5	Uong	Truoc an	18000.00	2026-02-03 17:00:00+00
160	67	81	10	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	7000.00	2026-02-03 17:00:00+00
161	68	27	2	Sau an	Theo chi dinh	5	Uong	Sau an	15000.00	2026-02-18 17:00:00+00
162	68	36	2	Sau an	Theo chi dinh	5	Uong	Sau an	12000.00	2026-02-18 17:00:00+00
163	69	34	8	Sau an	Theo chi dinh	5	Uong	Sau an	25000.00	2026-01-10 17:00:00+00
164	70	45	6	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	5000.00	2026-02-26 17:00:00+00
165	72	41	4	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	30000.00	2026-02-15 17:00:00+00
166	72	16	2	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	30000.00	2026-02-15 17:00:00+00
167	73	74	7	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	15000.00	2026-03-27 17:00:00+00
168	73	50	8	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-03-27 17:00:00+00
169	74	41	10	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	30000.00	2026-04-09 17:00:00+00
170	74	58	6	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	18000.00	2026-04-09 17:00:00+00
171	75	53	8	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	25000.00	2026-03-18 17:00:00+00
172	75	88	3	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	15000.00	2026-03-18 17:00:00+00
173	75	63	10	1 vien/ngay	1 vien/ngay	5	Uong	1 vien/ngay	12000.00	2026-03-18 17:00:00+00
174	75	54	4	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	35000.00	2026-03-18 17:00:00+00
175	76	100	10	Truoc an	Theo chi dinh	5	Uong	Truoc an	7000.00	2026-04-07 17:00:00+00
176	76	59	8	Sau an	Theo chi dinh	5	Uong	Sau an	35000.00	2026-04-07 17:00:00+00
177	77	70	8	Sau an	Theo chi dinh	5	Uong	Sau an	10000.00	2026-02-09 17:00:00+00
178	77	97	4	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	25000.00	2026-02-09 17:00:00+00
179	77	6	2	Truoc an	Theo chi dinh	5	Uong	Truoc an	12000.00	2026-02-09 17:00:00+00
180	78	34	2	2 vien/ngay	2 vien/ngay	5	Uong	2 vien/ngay	25000.00	2026-02-02 17:00:00+00
181	78	45	4	Truoc an	Theo chi dinh	5	Uong	Truoc an	5000.00	2026-02-02 17:00:00+00
182	78	12	10	Truoc an	Theo chi dinh	5	Uong	Truoc an	20000.00	2026-02-02 17:00:00+00
183	78	57	6	Truoc an	Theo chi dinh	5	Uong	Truoc an	15000.00	2026-02-02 17:00:00+00
184	79	8	6	Sau an	Theo chi dinh	5	Uong	Sau an	35000.00	2026-03-29 17:00:00+00
185	79	73	5	Sau an	Theo chi dinh	5	Uong	Sau an	35000.00	2026-03-29 17:00:00+00
186	81	66	3	1 chai/ngay	1 chai/ngay	5	Uong	1 chai/ngay	7000.00	2026-03-26 17:00:00+00
187	81	87	1	1 goi/ngay	1 goi/ngay	5	Uong	1 goi/ngay	7000.00	2026-03-26 17:00:00+00
188	81	13	3	Truoc an	Theo chi dinh	5	Uong	Truoc an	30000.00	2026-03-26 17:00:00+00
\.


--
-- Data for Name: chuyen_khoa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chuyen_khoa (id, ten_chuyen_khoa, mo_ta, trang_thai, ngay_tao, ngay_cap_nhat) FROM stdin;
1	Tai mũi họng	Chuyen khoa Tai mũi họng	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
2	Khoa nhi	Chuyen khoa Khoa nhi	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
3	Khoa mắt	Chuyen khoa Khoa mắt	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
4	Khoa xét nghiệm	Chuyen khoa Khoa xét nghiệm	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
\.


--
-- Data for Name: danh_muc_ten_benh; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.danh_muc_ten_benh (id, ma_benh, ten_benh, mo_ta, nhom_benh, trang_thai, ngay_tao, ngay_cap_nhat) FROM stdin;
1	BENH001	Roi loan tieu hoa	Danh muc benh Roi loan tieu hoa	Tieu hoa	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
2	BENH002	Viem hong	Danh muc benh Viem hong	Ho hap	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
3	BENH003	Viem phoi	Danh muc benh Viem phoi	Ho hap	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
4	BENH004	Dau da day	Danh muc benh Dau da day	Tieu hoa	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
5	BENH005	Hoi chung met moi	Danh muc benh Hoi chung met moi	Toan than	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
6	BENH006	Tang huyet ap nhe	Danh muc benh Tang huyet ap nhe	Tim mach	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
7	BENH007	Di ung	Danh muc benh Di ung	Di ung - mien dich	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
8	BENH008	Cam cum	Danh muc benh Cam cum	Ho hap	Active	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
\.


--
-- Data for Name: don_thuoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.don_thuoc (id, phieu_kham_id, benh_nhan_id, bac_si_id, ngay_ke_don, ghi_chu, trang_thai, ngay_tao, ngay_cap_nhat) FROM stdin;
1	1	12	3	2026-02-15	Uong sau bua an	Da ke	2026-02-14 17:00:00+00	2026-02-14 17:00:00+00
2	2	8	1	2026-01-07	3 lan/ngay	Da ke	2026-01-06 17:00:00+00	2026-01-06 17:00:00+00
3	3	38	1	2026-03-02	3 lan/ngay	Da ke	2026-03-01 17:00:00+00	2026-03-01 17:00:00+00
4	4	3	5	2026-02-27	2 lan/ngay	Da ke	2026-02-26 17:00:00+00	2026-02-26 17:00:00+00
5	5	31	4	2026-02-08	2 lan/ngay	Da ke	2026-02-07 17:00:00+00	2026-02-07 17:00:00+00
6	6	9	3	2026-01-11	Uong sau bua an	Da ke	2026-01-10 17:00:00+00	2026-01-10 17:00:00+00
7	7	39	5	2026-03-21	Uong truoc khi ngu	Da ke	2026-03-20 17:00:00+00	2026-03-20 17:00:00+00
8	8	45	1	2026-02-07	Uong sau bua an	Da ke	2026-02-06 17:00:00+00	2026-02-06 17:00:00+00
9	9	29	2	2026-04-20	2 lan/ngay	Da ke	2026-04-19 17:00:00+00	2026-04-19 17:00:00+00
10	10	27	1	2026-02-22	Khi can	Da ke	2026-02-21 17:00:00+00	2026-02-21 17:00:00+00
11	11	6	1	2026-01-20	Uong truoc khi ngu	Da ke	2026-01-19 17:00:00+00	2026-01-19 17:00:00+00
12	12	39	3	2026-02-15	Uong sau bua an	Da ke	2026-02-14 17:00:00+00	2026-02-14 17:00:00+00
13	13	43	4	2026-02-15	Uong truoc khi ngu	Da ke	2026-02-14 17:00:00+00	2026-02-14 17:00:00+00
14	14	43	3	2026-04-09	Khi can	Da ke	2026-04-08 17:00:00+00	2026-04-08 17:00:00+00
15	15	10	5	2026-02-13	2 lan/ngay	Da ke	2026-02-12 17:00:00+00	2026-02-12 17:00:00+00
16	16	48	1	2026-03-26	2 lan/ngay	Da ke	2026-03-25 17:00:00+00	2026-03-25 17:00:00+00
17	17	27	4	2026-01-12	2 lan/ngay	Da ke	2026-01-11 17:00:00+00	2026-01-11 17:00:00+00
18	18	47	3	2026-02-13	2 lan/ngay	Da ke	2026-02-12 17:00:00+00	2026-02-12 17:00:00+00
19	19	29	4	2026-02-26	2 lan/ngay	Da ke	2026-02-25 17:00:00+00	2026-02-25 17:00:00+00
20	20	28	1	2026-02-04	Uong sau bua an	Da ke	2026-02-03 17:00:00+00	2026-02-03 17:00:00+00
21	21	43	3	2026-02-06	Sau an	Da ke	2026-02-05 17:00:00+00	2026-02-05 17:00:00+00
22	22	4	1	2026-01-06	Uong sau bua an	Da ke	2026-01-05 17:00:00+00	2026-01-05 17:00:00+00
23	23	32	4	2026-02-07	Sau an	Da ke	2026-02-06 17:00:00+00	2026-02-06 17:00:00+00
24	24	46	2	2026-01-23	Khi can	Da ke	2026-01-22 17:00:00+00	2026-01-22 17:00:00+00
25	25	26	1	2026-03-06	Uong sau bua an	Da ke	2026-03-05 17:00:00+00	2026-03-05 17:00:00+00
26	26	21	2	2026-02-07	Sau an	Da ke	2026-02-06 17:00:00+00	2026-02-06 17:00:00+00
27	27	28	5	2026-01-12	Khi can	Da ke	2026-01-11 17:00:00+00	2026-01-11 17:00:00+00
28	28	20	3	2026-02-21	Uong sau bua an	Da ke	2026-02-20 17:00:00+00	2026-02-20 17:00:00+00
29	29	33	1	2026-01-29	2 lan/ngay	Da ke	2026-01-28 17:00:00+00	2026-01-28 17:00:00+00
30	30	10	3	2026-02-14	Uong truoc khi ngu	Da ke	2026-02-13 17:00:00+00	2026-02-13 17:00:00+00
32	32	33	1	2026-04-12	Uong truoc khi ngu	Da ke	2026-04-11 17:00:00+00	2026-04-11 17:00:00+00
34	34	38	5	2026-03-18	Khi can	Da ke	2026-03-17 17:00:00+00	2026-03-17 17:00:00+00
35	35	10	1	2026-02-11	2 lan/ngay	Da ke	2026-02-10 17:00:00+00	2026-02-10 17:00:00+00
36	36	46	4	2026-03-24	3 lan/ngay	Da ke	2026-03-23 17:00:00+00	2026-03-23 17:00:00+00
38	38	7	5	2026-04-12	Sau an	Da ke	2026-04-11 17:00:00+00	2026-04-11 17:00:00+00
39	39	47	5	2026-03-28	2 lan/ngay	Da ke	2026-03-27 17:00:00+00	2026-03-27 17:00:00+00
40	40	38	2	2026-04-22	Uong sau bua an	Da ke	2026-04-21 17:00:00+00	2026-04-21 17:00:00+00
42	42	20	2	2026-03-07	Uong sau bua an	Da ke	2026-03-06 17:00:00+00	2026-03-06 17:00:00+00
43	43	15	2	2026-01-28	Khi can	Da ke	2026-01-27 17:00:00+00	2026-01-27 17:00:00+00
44	44	11	2	2026-01-17	Khi can	Da ke	2026-01-16 17:00:00+00	2026-01-16 17:00:00+00
46	46	16	3	2026-04-07	Uong truoc khi ngu	Da ke	2026-04-06 17:00:00+00	2026-04-06 17:00:00+00
47	47	44	5	2026-04-14	3 lan/ngay	Da ke	2026-04-13 17:00:00+00	2026-04-13 17:00:00+00
48	48	6	2	2026-03-12	Uong truoc khi ngu	Da ke	2026-03-11 17:00:00+00	2026-03-11 17:00:00+00
49	49	25	1	2026-01-07	2 lan/ngay	Da ke	2026-01-06 17:00:00+00	2026-01-06 17:00:00+00
50	50	7	3	2026-02-17	2 lan/ngay	Da ke	2026-02-16 17:00:00+00	2026-02-16 17:00:00+00
51	51	19	4	2026-04-12	Sau an	Da ke	2026-04-11 17:00:00+00	2026-04-11 17:00:00+00
52	52	40	1	2026-03-31	Uong sau bua an	Da ke	2026-03-30 17:00:00+00	2026-03-30 17:00:00+00
53	53	10	5	2026-01-11	Khi can	Da ke	2026-01-10 17:00:00+00	2026-01-10 17:00:00+00
54	54	50	3	2026-04-04	Sau an	Da ke	2026-04-03 17:00:00+00	2026-04-03 17:00:00+00
56	56	8	4	2026-03-23	Khi can	Da ke	2026-03-22 17:00:00+00	2026-03-22 17:00:00+00
57	57	1	5	2026-01-31	Uong truoc khi ngu	Da ke	2026-01-30 17:00:00+00	2026-01-30 17:00:00+00
58	58	43	1	2026-02-15	3 lan/ngay	Da ke	2026-02-14 17:00:00+00	2026-02-14 17:00:00+00
60	60	31	1	2026-04-11	3 lan/ngay	Da ke	2026-04-10 17:00:00+00	2026-04-10 17:00:00+00
61	61	48	1	2026-03-23	Uong sau bua an	Da ke	2026-03-22 17:00:00+00	2026-03-22 17:00:00+00
62	62	47	1	2026-02-15	2 lan/ngay	Da ke	2026-02-14 17:00:00+00	2026-02-14 17:00:00+00
63	63	3	3	2026-04-09	Sau an	Da ke	2026-04-08 17:00:00+00	2026-04-08 17:00:00+00
64	64	13	1	2026-04-02	Khi can	Da ke	2026-04-01 17:00:00+00	2026-04-01 17:00:00+00
65	65	20	5	2026-04-12	3 lan/ngay	Da ke	2026-04-11 17:00:00+00	2026-04-11 17:00:00+00
66	66	3	2	2026-02-20	Khi can	Da ke	2026-02-19 17:00:00+00	2026-02-19 17:00:00+00
67	67	26	4	2026-02-04	Uong truoc khi ngu	Da ke	2026-02-03 17:00:00+00	2026-02-03 17:00:00+00
68	68	45	4	2026-02-19	3 lan/ngay	Da ke	2026-02-18 17:00:00+00	2026-02-18 17:00:00+00
69	69	19	3	2026-01-11	Khi can	Da ke	2026-01-10 17:00:00+00	2026-01-10 17:00:00+00
70	70	45	4	2026-02-27	2 lan/ngay	Da ke	2026-02-26 17:00:00+00	2026-02-26 17:00:00+00
72	72	10	5	2026-02-16	3 lan/ngay	Da ke	2026-02-15 17:00:00+00	2026-02-15 17:00:00+00
73	73	5	2	2026-03-28	Khi can	Da ke	2026-03-27 17:00:00+00	2026-03-27 17:00:00+00
74	74	37	1	2026-04-10	Uong sau bua an	Da ke	2026-04-09 17:00:00+00	2026-04-09 17:00:00+00
75	75	24	4	2026-03-19	Khi can	Da ke	2026-03-18 17:00:00+00	2026-03-18 17:00:00+00
76	76	24	4	2026-04-08	Uong truoc khi ngu	Da ke	2026-04-07 17:00:00+00	2026-04-07 17:00:00+00
77	77	2	2	2026-02-10	2 lan/ngay	Da ke	2026-02-09 17:00:00+00	2026-02-09 17:00:00+00
78	78	40	3	2026-02-03	Sau an	Da ke	2026-02-02 17:00:00+00	2026-02-02 17:00:00+00
79	79	9	1	2026-03-30	Uong sau bua an	Da ke	2026-03-29 17:00:00+00	2026-03-29 17:00:00+00
81	81	35	3	2026-03-27	2 lan/ngay	Da ke	2026-03-26 17:00:00+00	2026-03-26 17:00:00+00
\.


--
-- Data for Name: giao_dich_kho_thuoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.giao_dich_kho_thuoc (id, thuoc_id, loai_giao_dich, so_luong, tham_chieu_id, ghi_chu, ngay_tao) FROM stdin;
1	1	NHAP_KHO	240	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
2	2	NHAP_KHO	152	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
3	3	NHAP_KHO	65	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
4	4	NHAP_KHO	61	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
5	5	NHAP_KHO	84	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
6	6	NHAP_KHO	245	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
7	7	NHAP_KHO	35	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
8	8	NHAP_KHO	98	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
9	9	NHAP_KHO	79	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
10	10	NHAP_KHO	153	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
11	11	NHAP_KHO	95	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
12	12	NHAP_KHO	48	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
13	13	NHAP_KHO	203	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
14	14	NHAP_KHO	199	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
15	15	NHAP_KHO	53	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
16	16	NHAP_KHO	105	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
17	17	NHAP_KHO	199	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
18	18	NHAP_KHO	138	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
19	19	NHAP_KHO	110	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
20	20	NHAP_KHO	202	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
21	21	NHAP_KHO	176	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
22	22	NHAP_KHO	142	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
23	23	NHAP_KHO	241	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
24	24	NHAP_KHO	105	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
25	25	NHAP_KHO	138	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
26	26	NHAP_KHO	236	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
27	27	NHAP_KHO	103	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
28	28	NHAP_KHO	243	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
29	29	NHAP_KHO	128	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
30	30	NHAP_KHO	236	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
31	31	NHAP_KHO	88	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
32	32	NHAP_KHO	154	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
33	33	NHAP_KHO	207	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
34	34	NHAP_KHO	134	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
35	35	NHAP_KHO	60	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
36	36	NHAP_KHO	160	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
37	37	NHAP_KHO	84	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
38	38	NHAP_KHO	185	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
39	39	NHAP_KHO	238	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
40	40	NHAP_KHO	243	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
41	41	NHAP_KHO	184	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
42	42	NHAP_KHO	180	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
43	43	NHAP_KHO	144	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
44	44	NHAP_KHO	89	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
45	45	NHAP_KHO	130	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
46	46	NHAP_KHO	200	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
47	47	NHAP_KHO	148	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
48	48	NHAP_KHO	54	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
49	49	NHAP_KHO	151	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
50	50	NHAP_KHO	114	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
51	51	NHAP_KHO	251	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
52	52	NHAP_KHO	102	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
53	53	NHAP_KHO	52	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
54	54	NHAP_KHO	105	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
55	55	NHAP_KHO	214	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
56	56	NHAP_KHO	84	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
57	57	NHAP_KHO	231	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
58	58	NHAP_KHO	87	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
59	59	NHAP_KHO	233	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
60	60	NHAP_KHO	259	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
61	61	NHAP_KHO	169	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
62	62	NHAP_KHO	141	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
63	63	NHAP_KHO	203	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
64	64	NHAP_KHO	170	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
65	65	NHAP_KHO	136	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
66	66	NHAP_KHO	92	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
67	67	NHAP_KHO	199	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
68	68	NHAP_KHO	114	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
69	69	NHAP_KHO	43	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
70	70	NHAP_KHO	196	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
71	71	NHAP_KHO	97	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
72	72	NHAP_KHO	242	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
73	73	NHAP_KHO	47	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
74	74	NHAP_KHO	223	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
75	75	NHAP_KHO	127	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
76	76	NHAP_KHO	155	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
77	77	NHAP_KHO	244	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
78	78	NHAP_KHO	139	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
79	79	NHAP_KHO	214	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
80	80	NHAP_KHO	48	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
81	81	NHAP_KHO	150	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
82	82	NHAP_KHO	182	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
83	83	NHAP_KHO	98	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
84	84	NHAP_KHO	188	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
85	85	NHAP_KHO	199	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
86	86	NHAP_KHO	38	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
87	87	NHAP_KHO	97	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
88	88	NHAP_KHO	197	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
89	89	NHAP_KHO	223	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
90	90	NHAP_KHO	247	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
91	91	NHAP_KHO	204	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
92	92	NHAP_KHO	249	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
93	93	NHAP_KHO	279	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
94	94	NHAP_KHO	68	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
95	95	NHAP_KHO	184	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
96	96	NHAP_KHO	82	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
97	97	NHAP_KHO	88	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
98	98	NHAP_KHO	218	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
99	99	NHAP_KHO	55	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
100	100	NHAP_KHO	208	\N	Khoi tao ton kho dau ky	2026-01-01 01:00:00+00
101	69	XUAT_DON_THUOC	5	1	Xuat thuoc theo don 1	2026-02-15 10:00:00+00
102	44	XUAT_DON_THUOC	8	1	Xuat thuoc theo don 1	2026-02-15 10:00:00+00
103	70	XUAT_DON_THUOC	4	1	Xuat thuoc theo don 1	2026-02-15 10:00:00+00
104	46	XUAT_DON_THUOC	9	1	Xuat thuoc theo don 1	2026-02-15 10:00:00+00
105	89	XUAT_DON_THUOC	8	2	Xuat thuoc theo don 2	2026-01-07 10:00:00+00
106	91	XUAT_DON_THUOC	8	2	Xuat thuoc theo don 2	2026-01-07 10:00:00+00
107	51	XUAT_DON_THUOC	5	3	Xuat thuoc theo don 3	2026-03-02 10:00:00+00
108	45	XUAT_DON_THUOC	5	3	Xuat thuoc theo don 3	2026-03-02 10:00:00+00
109	99	XUAT_DON_THUOC	2	3	Xuat thuoc theo don 3	2026-03-02 10:00:00+00
110	19	XUAT_DON_THUOC	8	3	Xuat thuoc theo don 3	2026-03-02 10:00:00+00
111	72	XUAT_DON_THUOC	3	4	Xuat thuoc theo don 4	2026-02-27 10:00:00+00
112	90	XUAT_DON_THUOC	10	4	Xuat thuoc theo don 4	2026-02-27 10:00:00+00
113	35	XUAT_DON_THUOC	10	4	Xuat thuoc theo don 4	2026-02-27 10:00:00+00
114	82	XUAT_DON_THUOC	1	5	Xuat thuoc theo don 5	2026-02-08 10:00:00+00
115	30	XUAT_DON_THUOC	7	5	Xuat thuoc theo don 5	2026-02-08 10:00:00+00
116	71	XUAT_DON_THUOC	3	6	Xuat thuoc theo don 6	2026-01-11 10:00:00+00
117	37	XUAT_DON_THUOC	2	7	Xuat thuoc theo don 7	2026-03-21 10:00:00+00
118	83	XUAT_DON_THUOC	10	7	Xuat thuoc theo don 7	2026-03-21 10:00:00+00
119	8	XUAT_DON_THUOC	9	7	Xuat thuoc theo don 7	2026-03-21 10:00:00+00
120	51	XUAT_DON_THUOC	8	8	Xuat thuoc theo don 8	2026-02-07 10:00:00+00
121	43	XUAT_DON_THUOC	5	9	Xuat thuoc theo don 9	2026-04-20 10:00:00+00
122	25	XUAT_DON_THUOC	3	10	Xuat thuoc theo don 10	2026-02-22 10:00:00+00
123	15	XUAT_DON_THUOC	8	10	Xuat thuoc theo don 10	2026-02-22 10:00:00+00
124	43	XUAT_DON_THUOC	5	10	Xuat thuoc theo don 10	2026-02-22 10:00:00+00
125	23	XUAT_DON_THUOC	7	11	Xuat thuoc theo don 11	2026-01-20 10:00:00+00
126	79	XUAT_DON_THUOC	9	11	Xuat thuoc theo don 11	2026-01-20 10:00:00+00
127	62	XUAT_DON_THUOC	4	12	Xuat thuoc theo don 12	2026-02-15 10:00:00+00
128	42	XUAT_DON_THUOC	5	12	Xuat thuoc theo don 12	2026-02-15 10:00:00+00
129	75	XUAT_DON_THUOC	1	13	Xuat thuoc theo don 13	2026-02-15 10:00:00+00
130	93	XUAT_DON_THUOC	6	13	Xuat thuoc theo don 13	2026-02-15 10:00:00+00
131	74	XUAT_DON_THUOC	4	13	Xuat thuoc theo don 13	2026-02-15 10:00:00+00
132	89	XUAT_DON_THUOC	5	14	Xuat thuoc theo don 14	2026-04-09 10:00:00+00
133	16	XUAT_DON_THUOC	10	14	Xuat thuoc theo don 14	2026-04-09 10:00:00+00
134	82	XUAT_DON_THUOC	4	14	Xuat thuoc theo don 14	2026-04-09 10:00:00+00
135	54	XUAT_DON_THUOC	8	15	Xuat thuoc theo don 15	2026-02-13 10:00:00+00
136	90	XUAT_DON_THUOC	4	15	Xuat thuoc theo don 15	2026-02-13 10:00:00+00
137	71	XUAT_DON_THUOC	10	15	Xuat thuoc theo don 15	2026-02-13 10:00:00+00
138	8	XUAT_DON_THUOC	9	16	Xuat thuoc theo don 16	2026-03-26 10:00:00+00
139	15	XUAT_DON_THUOC	10	17	Xuat thuoc theo don 17	2026-01-12 10:00:00+00
140	88	XUAT_DON_THUOC	2	17	Xuat thuoc theo don 17	2026-01-12 10:00:00+00
141	27	XUAT_DON_THUOC	8	17	Xuat thuoc theo don 17	2026-01-12 10:00:00+00
142	92	XUAT_DON_THUOC	8	17	Xuat thuoc theo don 17	2026-01-12 10:00:00+00
143	87	XUAT_DON_THUOC	7	18	Xuat thuoc theo don 18	2026-02-13 10:00:00+00
144	40	XUAT_DON_THUOC	1	18	Xuat thuoc theo don 18	2026-02-13 10:00:00+00
145	93	XUAT_DON_THUOC	4	18	Xuat thuoc theo don 18	2026-02-13 10:00:00+00
146	3	XUAT_DON_THUOC	2	18	Xuat thuoc theo don 18	2026-02-13 10:00:00+00
147	9	XUAT_DON_THUOC	8	19	Xuat thuoc theo don 19	2026-02-26 10:00:00+00
148	48	XUAT_DON_THUOC	9	20	Xuat thuoc theo don 20	2026-02-04 10:00:00+00
149	49	XUAT_DON_THUOC	6	20	Xuat thuoc theo don 20	2026-02-04 10:00:00+00
150	58	XUAT_DON_THUOC	3	20	Xuat thuoc theo don 20	2026-02-04 10:00:00+00
151	11	XUAT_DON_THUOC	7	20	Xuat thuoc theo don 20	2026-02-04 10:00:00+00
152	60	XUAT_DON_THUOC	9	21	Xuat thuoc theo don 21	2026-02-06 10:00:00+00
153	87	XUAT_DON_THUOC	9	21	Xuat thuoc theo don 21	2026-02-06 10:00:00+00
154	93	XUAT_DON_THUOC	4	21	Xuat thuoc theo don 21	2026-02-06 10:00:00+00
155	5	XUAT_DON_THUOC	7	22	Xuat thuoc theo don 22	2026-01-06 10:00:00+00
156	58	XUAT_DON_THUOC	10	23	Xuat thuoc theo don 23	2026-02-07 10:00:00+00
157	30	XUAT_DON_THUOC	1	24	Xuat thuoc theo don 24	2026-01-23 10:00:00+00
158	70	XUAT_DON_THUOC	9	24	Xuat thuoc theo don 24	2026-01-23 10:00:00+00
159	28	XUAT_DON_THUOC	4	24	Xuat thuoc theo don 24	2026-01-23 10:00:00+00
160	97	XUAT_DON_THUOC	10	24	Xuat thuoc theo don 24	2026-01-23 10:00:00+00
161	53	XUAT_DON_THUOC	5	25	Xuat thuoc theo don 25	2026-03-06 10:00:00+00
162	39	XUAT_DON_THUOC	9	25	Xuat thuoc theo don 25	2026-03-06 10:00:00+00
163	83	XUAT_DON_THUOC	9	26	Xuat thuoc theo don 26	2026-02-07 10:00:00+00
164	86	XUAT_DON_THUOC	7	26	Xuat thuoc theo don 26	2026-02-07 10:00:00+00
165	49	XUAT_DON_THUOC	3	26	Xuat thuoc theo don 26	2026-02-07 10:00:00+00
166	29	XUAT_DON_THUOC	3	27	Xuat thuoc theo don 27	2026-01-12 10:00:00+00
167	39	XUAT_DON_THUOC	1	27	Xuat thuoc theo don 27	2026-01-12 10:00:00+00
168	32	XUAT_DON_THUOC	2	28	Xuat thuoc theo don 28	2026-02-21 10:00:00+00
169	33	XUAT_DON_THUOC	6	28	Xuat thuoc theo don 28	2026-02-21 10:00:00+00
170	27	XUAT_DON_THUOC	9	28	Xuat thuoc theo don 28	2026-02-21 10:00:00+00
171	43	XUAT_DON_THUOC	4	28	Xuat thuoc theo don 28	2026-02-21 10:00:00+00
172	10	XUAT_DON_THUOC	4	29	Xuat thuoc theo don 29	2026-01-29 10:00:00+00
173	2	XUAT_DON_THUOC	2	30	Xuat thuoc theo don 30	2026-02-14 10:00:00+00
174	28	XUAT_DON_THUOC	8	30	Xuat thuoc theo don 30	2026-02-14 10:00:00+00
175	25	XUAT_DON_THUOC	10	30	Xuat thuoc theo don 30	2026-02-14 10:00:00+00
176	60	XUAT_DON_THUOC	5	32	Xuat thuoc theo don 32	2026-04-12 10:00:00+00
177	69	XUAT_DON_THUOC	6	32	Xuat thuoc theo don 32	2026-04-12 10:00:00+00
178	84	XUAT_DON_THUOC	8	32	Xuat thuoc theo don 32	2026-04-12 10:00:00+00
179	46	XUAT_DON_THUOC	2	32	Xuat thuoc theo don 32	2026-04-12 10:00:00+00
180	73	XUAT_DON_THUOC	4	34	Xuat thuoc theo don 34	2026-03-18 10:00:00+00
181	38	XUAT_DON_THUOC	4	35	Xuat thuoc theo don 35	2026-02-11 10:00:00+00
182	20	XUAT_DON_THUOC	10	35	Xuat thuoc theo don 35	2026-02-11 10:00:00+00
183	26	XUAT_DON_THUOC	8	35	Xuat thuoc theo don 35	2026-02-11 10:00:00+00
184	43	XUAT_DON_THUOC	6	35	Xuat thuoc theo don 35	2026-02-11 10:00:00+00
185	22	XUAT_DON_THUOC	9	36	Xuat thuoc theo don 36	2026-03-24 10:00:00+00
186	18	XUAT_DON_THUOC	3	36	Xuat thuoc theo don 36	2026-03-24 10:00:00+00
187	93	XUAT_DON_THUOC	1	36	Xuat thuoc theo don 36	2026-03-24 10:00:00+00
188	18	XUAT_DON_THUOC	3	38	Xuat thuoc theo don 38	2026-04-12 10:00:00+00
189	81	XUAT_DON_THUOC	4	38	Xuat thuoc theo don 38	2026-04-12 10:00:00+00
190	30	XUAT_DON_THUOC	8	38	Xuat thuoc theo don 38	2026-04-12 10:00:00+00
191	9	XUAT_DON_THUOC	1	38	Xuat thuoc theo don 38	2026-04-12 10:00:00+00
192	2	XUAT_DON_THUOC	5	39	Xuat thuoc theo don 39	2026-03-28 10:00:00+00
193	3	XUAT_DON_THUOC	5	39	Xuat thuoc theo don 39	2026-03-28 10:00:00+00
194	68	XUAT_DON_THUOC	9	39	Xuat thuoc theo don 39	2026-03-28 10:00:00+00
195	93	XUAT_DON_THUOC	7	39	Xuat thuoc theo don 39	2026-03-28 10:00:00+00
196	80	XUAT_DON_THUOC	5	40	Xuat thuoc theo don 40	2026-04-22 10:00:00+00
197	68	XUAT_DON_THUOC	5	40	Xuat thuoc theo don 40	2026-04-22 10:00:00+00
198	39	XUAT_DON_THUOC	2	42	Xuat thuoc theo don 42	2026-03-07 10:00:00+00
199	88	XUAT_DON_THUOC	1	42	Xuat thuoc theo don 42	2026-03-07 10:00:00+00
200	82	XUAT_DON_THUOC	1	43	Xuat thuoc theo don 43	2026-01-28 10:00:00+00
201	73	XUAT_DON_THUOC	1	44	Xuat thuoc theo don 44	2026-01-17 10:00:00+00
202	13	XUAT_DON_THUOC	4	44	Xuat thuoc theo don 44	2026-01-17 10:00:00+00
203	68	XUAT_DON_THUOC	10	44	Xuat thuoc theo don 44	2026-01-17 10:00:00+00
204	23	XUAT_DON_THUOC	6	46	Xuat thuoc theo don 46	2026-04-07 10:00:00+00
205	10	XUAT_DON_THUOC	4	47	Xuat thuoc theo don 47	2026-04-14 10:00:00+00
206	39	XUAT_DON_THUOC	7	47	Xuat thuoc theo don 47	2026-04-14 10:00:00+00
207	21	XUAT_DON_THUOC	9	47	Xuat thuoc theo don 47	2026-04-14 10:00:00+00
208	73	XUAT_DON_THUOC	7	47	Xuat thuoc theo don 47	2026-04-14 10:00:00+00
209	13	XUAT_DON_THUOC	7	48	Xuat thuoc theo don 48	2026-03-12 10:00:00+00
210	100	XUAT_DON_THUOC	5	49	Xuat thuoc theo don 49	2026-01-07 10:00:00+00
211	42	XUAT_DON_THUOC	8	49	Xuat thuoc theo don 49	2026-01-07 10:00:00+00
212	4	XUAT_DON_THUOC	6	49	Xuat thuoc theo don 49	2026-01-07 10:00:00+00
213	82	XUAT_DON_THUOC	7	49	Xuat thuoc theo don 49	2026-01-07 10:00:00+00
214	32	XUAT_DON_THUOC	2	50	Xuat thuoc theo don 50	2026-02-17 10:00:00+00
215	92	XUAT_DON_THUOC	3	50	Xuat thuoc theo don 50	2026-02-17 10:00:00+00
216	10	XUAT_DON_THUOC	3	50	Xuat thuoc theo don 50	2026-02-17 10:00:00+00
217	40	XUAT_DON_THUOC	8	51	Xuat thuoc theo don 51	2026-04-12 10:00:00+00
218	58	XUAT_DON_THUOC	2	52	Xuat thuoc theo don 52	2026-03-31 10:00:00+00
219	72	XUAT_DON_THUOC	2	52	Xuat thuoc theo don 52	2026-03-31 10:00:00+00
220	66	XUAT_DON_THUOC	9	52	Xuat thuoc theo don 52	2026-03-31 10:00:00+00
221	53	XUAT_DON_THUOC	10	52	Xuat thuoc theo don 52	2026-03-31 10:00:00+00
222	100	XUAT_DON_THUOC	4	53	Xuat thuoc theo don 53	2026-01-11 10:00:00+00
223	11	XUAT_DON_THUOC	9	53	Xuat thuoc theo don 53	2026-01-11 10:00:00+00
224	93	XUAT_DON_THUOC	7	53	Xuat thuoc theo don 53	2026-01-11 10:00:00+00
225	72	XUAT_DON_THUOC	3	53	Xuat thuoc theo don 53	2026-01-11 10:00:00+00
226	56	XUAT_DON_THUOC	7	54	Xuat thuoc theo don 54	2026-04-04 10:00:00+00
227	36	XUAT_DON_THUOC	8	54	Xuat thuoc theo don 54	2026-04-04 10:00:00+00
228	59	XUAT_DON_THUOC	3	56	Xuat thuoc theo don 56	2026-03-23 10:00:00+00
229	14	XUAT_DON_THUOC	1	56	Xuat thuoc theo don 56	2026-03-23 10:00:00+00
230	43	XUAT_DON_THUOC	3	57	Xuat thuoc theo don 57	2026-01-31 10:00:00+00
231	56	XUAT_DON_THUOC	6	57	Xuat thuoc theo don 57	2026-01-31 10:00:00+00
232	84	XUAT_DON_THUOC	4	57	Xuat thuoc theo don 57	2026-01-31 10:00:00+00
233	77	XUAT_DON_THUOC	6	57	Xuat thuoc theo don 57	2026-01-31 10:00:00+00
234	74	XUAT_DON_THUOC	5	58	Xuat thuoc theo don 58	2026-02-15 10:00:00+00
235	32	XUAT_DON_THUOC	6	58	Xuat thuoc theo don 58	2026-02-15 10:00:00+00
236	42	XUAT_DON_THUOC	10	58	Xuat thuoc theo don 58	2026-02-15 10:00:00+00
237	49	XUAT_DON_THUOC	10	58	Xuat thuoc theo don 58	2026-02-15 10:00:00+00
238	57	XUAT_DON_THUOC	2	60	Xuat thuoc theo don 60	2026-04-11 10:00:00+00
239	38	XUAT_DON_THUOC	8	60	Xuat thuoc theo don 60	2026-04-11 10:00:00+00
240	49	XUAT_DON_THUOC	8	61	Xuat thuoc theo don 61	2026-03-23 10:00:00+00
241	10	XUAT_DON_THUOC	7	61	Xuat thuoc theo don 61	2026-03-23 10:00:00+00
242	58	XUAT_DON_THUOC	9	61	Xuat thuoc theo don 61	2026-03-23 10:00:00+00
243	77	XUAT_DON_THUOC	7	61	Xuat thuoc theo don 61	2026-03-23 10:00:00+00
244	14	XUAT_DON_THUOC	4	62	Xuat thuoc theo don 62	2026-02-15 10:00:00+00
245	97	XUAT_DON_THUOC	1	63	Xuat thuoc theo don 63	2026-04-09 10:00:00+00
246	43	XUAT_DON_THUOC	5	63	Xuat thuoc theo don 63	2026-04-09 10:00:00+00
247	56	XUAT_DON_THUOC	9	63	Xuat thuoc theo don 63	2026-04-09 10:00:00+00
248	14	XUAT_DON_THUOC	9	63	Xuat thuoc theo don 63	2026-04-09 10:00:00+00
249	45	XUAT_DON_THUOC	8	64	Xuat thuoc theo don 64	2026-04-02 10:00:00+00
250	4	XUAT_DON_THUOC	5	64	Xuat thuoc theo don 64	2026-04-02 10:00:00+00
251	45	XUAT_DON_THUOC	6	65	Xuat thuoc theo don 65	2026-04-12 10:00:00+00
252	40	XUAT_DON_THUOC	4	65	Xuat thuoc theo don 65	2026-04-12 10:00:00+00
253	41	XUAT_DON_THUOC	2	66	Xuat thuoc theo don 66	2026-02-20 10:00:00+00
254	9	XUAT_DON_THUOC	6	66	Xuat thuoc theo don 66	2026-02-20 10:00:00+00
255	39	XUAT_DON_THUOC	2	66	Xuat thuoc theo don 66	2026-02-20 10:00:00+00
256	6	XUAT_DON_THUOC	3	66	Xuat thuoc theo don 66	2026-02-20 10:00:00+00
257	60	XUAT_DON_THUOC	3	67	Xuat thuoc theo don 67	2026-02-04 10:00:00+00
258	30	XUAT_DON_THUOC	7	67	Xuat thuoc theo don 67	2026-02-04 10:00:00+00
259	52	XUAT_DON_THUOC	1	67	Xuat thuoc theo don 67	2026-02-04 10:00:00+00
260	81	XUAT_DON_THUOC	10	67	Xuat thuoc theo don 67	2026-02-04 10:00:00+00
261	27	XUAT_DON_THUOC	2	68	Xuat thuoc theo don 68	2026-02-19 10:00:00+00
262	36	XUAT_DON_THUOC	2	68	Xuat thuoc theo don 68	2026-02-19 10:00:00+00
263	34	XUAT_DON_THUOC	8	69	Xuat thuoc theo don 69	2026-01-11 10:00:00+00
264	45	XUAT_DON_THUOC	6	70	Xuat thuoc theo don 70	2026-02-27 10:00:00+00
265	41	XUAT_DON_THUOC	4	72	Xuat thuoc theo don 72	2026-02-16 10:00:00+00
266	16	XUAT_DON_THUOC	2	72	Xuat thuoc theo don 72	2026-02-16 10:00:00+00
267	74	XUAT_DON_THUOC	7	73	Xuat thuoc theo don 73	2026-03-28 10:00:00+00
268	50	XUAT_DON_THUOC	8	73	Xuat thuoc theo don 73	2026-03-28 10:00:00+00
269	41	XUAT_DON_THUOC	10	74	Xuat thuoc theo don 74	2026-04-10 10:00:00+00
270	58	XUAT_DON_THUOC	6	74	Xuat thuoc theo don 74	2026-04-10 10:00:00+00
271	53	XUAT_DON_THUOC	8	75	Xuat thuoc theo don 75	2026-03-19 10:00:00+00
272	88	XUAT_DON_THUOC	3	75	Xuat thuoc theo don 75	2026-03-19 10:00:00+00
273	63	XUAT_DON_THUOC	10	75	Xuat thuoc theo don 75	2026-03-19 10:00:00+00
274	54	XUAT_DON_THUOC	4	75	Xuat thuoc theo don 75	2026-03-19 10:00:00+00
275	100	XUAT_DON_THUOC	10	76	Xuat thuoc theo don 76	2026-04-08 10:00:00+00
276	59	XUAT_DON_THUOC	8	76	Xuat thuoc theo don 76	2026-04-08 10:00:00+00
277	70	XUAT_DON_THUOC	8	77	Xuat thuoc theo don 77	2026-02-10 10:00:00+00
278	97	XUAT_DON_THUOC	4	77	Xuat thuoc theo don 77	2026-02-10 10:00:00+00
279	6	XUAT_DON_THUOC	2	77	Xuat thuoc theo don 77	2026-02-10 10:00:00+00
280	34	XUAT_DON_THUOC	2	78	Xuat thuoc theo don 78	2026-02-03 10:00:00+00
281	45	XUAT_DON_THUOC	4	78	Xuat thuoc theo don 78	2026-02-03 10:00:00+00
282	12	XUAT_DON_THUOC	10	78	Xuat thuoc theo don 78	2026-02-03 10:00:00+00
283	57	XUAT_DON_THUOC	6	78	Xuat thuoc theo don 78	2026-02-03 10:00:00+00
284	8	XUAT_DON_THUOC	6	79	Xuat thuoc theo don 79	2026-03-30 10:00:00+00
285	73	XUAT_DON_THUOC	5	79	Xuat thuoc theo don 79	2026-03-30 10:00:00+00
286	66	XUAT_DON_THUOC	3	81	Xuat thuoc theo don 81	2026-03-27 10:00:00+00
287	87	XUAT_DON_THUOC	1	81	Xuat thuoc theo don 81	2026-03-27 10:00:00+00
288	13	XUAT_DON_THUOC	3	81	Xuat thuoc theo don 81	2026-03-27 10:00:00+00
\.


--
-- Data for Name: goi_y_thuoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.goi_y_thuoc (id, benh_id, thuoc_id, muc_do_uu_tien, muc_dich_su_dung, lieu_dung_goi_y, ghi_chu, dang_hoat_dong, ngay_tao, ngay_cap_nhat) FROM stdin;
1	1	74	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
2	1	42	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
3	1	93	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
4	1	49	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
5	1	46	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
6	2	56	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
7	2	30	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
8	2	43	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
9	2	100	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
10	2	84	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
11	3	82	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
12	3	83	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
13	3	16	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
14	3	8	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
15	3	48	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
16	4	90	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
17	4	35	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
18	4	97	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
19	4	63	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
20	4	70	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
21	5	10	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
22	5	25	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
23	5	79	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
24	5	39	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
25	5	21	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
26	6	68	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
27	6	53	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
28	6	12	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
29	6	66	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
30	6	51	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
31	7	9	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
32	7	71	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
33	7	83	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
34	7	54	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
35	7	86	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
36	8	58	1	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
37	8	41	2	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
38	8	39	3	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
39	8	30	4	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
40	8	34	5	Ho tro dieu tri theo chan doan	Theo chi dinh cua bac si	\N	t	2026-01-01 01:00:00+00	2026-01-01 01:00:00+00
\.


--
-- Data for Name: hoa_don; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hoa_don (id, phieu_kham_id, benh_nhan_id, ngay_lap, chi_phi_kham, tien_thuoc, tong_tien, trang_thai_thanh_toan, ngay_tao, ngay_cap_nhat, phuong_thuc_thanh_toan, thoi_gian_thanh_toan) FROM stdin;
HD001	1	12	2026-02-15	100000.00	722000.00	822000.00	Chua thanh toan	2026-02-15 10:00:00+00	2026-02-15 10:00:00+00	Tien mat	\N
HD002	2	8	2026-01-07	100000.00	280000.00	380000.00	Chua thanh toan	2026-01-07 10:00:00+00	2026-01-07 10:00:00+00	Tien mat	\N
HD003	3	38	2026-03-02	100000.00	396000.00	496000.00	Chua thanh toan	2026-03-02 10:00:00+00	2026-03-02 10:00:00+00	Tien mat	\N
HD004	4	3	2026-02-27	100000.00	375000.00	475000.00	Da thanh toan	2026-02-27 10:00:00+00	2026-02-27 10:00:00+00	Tien mat	\N
HD005	5	31	2026-02-08	100000.00	222000.00	322000.00	Da thanh toan	2026-02-08 10:00:00+00	2026-02-08 10:00:00+00	Tien mat	\N
HD006	6	9	2026-01-11	100000.00	90000.00	190000.00	Chua thanh toan	2026-01-11 10:00:00+00	2026-01-11 10:00:00+00	Tien mat	\N
HD007	7	39	2026-03-21	100000.00	705000.00	805000.00	Da thanh toan	2026-03-21 10:00:00+00	2026-03-21 10:00:00+00	Tien mat	\N
HD008	8	45	2026-02-07	100000.00	56000.00	156000.00	Da thanh toan	2026-02-07 10:00:00+00	2026-02-07 10:00:00+00	Tien mat	\N
HD009	9	29	2026-04-20	100000.00	125000.00	225000.00	Da thanh toan	2026-04-20 10:00:00+00	2026-04-20 10:00:00+00	Tien mat	\N
HD010	10	27	2026-02-22	100000.00	226000.00	326000.00	Da thanh toan	2026-02-22 10:00:00+00	2026-02-22 10:00:00+00	Tien mat	\N
HD011	11	6	2026-01-20	100000.00	560000.00	660000.00	Chua thanh toan	2026-01-20 10:00:00+00	2026-01-20 10:00:00+00	Tien mat	\N
HD012	12	39	2026-02-15	100000.00	148000.00	248000.00	Chua thanh toan	2026-02-15 10:00:00+00	2026-02-15 10:00:00+00	Tien mat	\N
HD013	13	43	2026-02-15	100000.00	250000.00	350000.00	Chua thanh toan	2026-02-15 10:00:00+00	2026-02-15 10:00:00+00	Tien mat	\N
HD014	14	43	2026-04-09	100000.00	498000.00	598000.00	Da thanh toan	2026-04-09 10:00:00+00	2026-04-09 10:00:00+00	Tien mat	\N
HD015	15	10	2026-02-13	100000.00	608000.00	708000.00	Chua thanh toan	2026-02-13 10:00:00+00	2026-02-13 10:00:00+00	Tien mat	\N
HD016	16	48	2026-03-26	100000.00	315000.00	415000.00	Da thanh toan	2026-03-26 10:00:00+00	2026-03-26 10:00:00+00	Tien mat	\N
HD017	17	27	2026-01-12	100000.00	300000.00	400000.00	Chua thanh toan	2026-01-12 10:00:00+00	2026-01-12 10:00:00+00	Tien mat	\N
HD018	18	47	2026-02-13	100000.00	171000.00	271000.00	Chua thanh toan	2026-02-13 10:00:00+00	2026-02-13 10:00:00+00	Tien mat	\N
HD019	19	29	2026-02-26	100000.00	80000.00	180000.00	Chua thanh toan	2026-02-26 10:00:00+00	2026-02-26 10:00:00+00	Tien mat	\N
HD020	20	28	2026-02-04	100000.00	317000.00	417000.00	Da thanh toan	2026-02-04 10:00:00+00	2026-02-04 10:00:00+00	Tien mat	\N
HD021	21	43	2026-02-06	100000.00	433000.00	533000.00	Chua thanh toan	2026-02-06 10:00:00+00	2026-02-06 10:00:00+00	Tien mat	\N
HD022	22	4	2026-01-06	100000.00	210000.00	310000.00	Da thanh toan	2026-01-06 10:00:00+00	2026-01-06 10:00:00+00	Tien mat	\N
HD023	23	32	2026-02-07	100000.00	180000.00	280000.00	Da thanh toan	2026-02-07 10:00:00+00	2026-02-07 10:00:00+00	Tien mat	\N
HD024	24	46	2026-01-23	100000.00	470000.00	570000.00	Da thanh toan	2026-01-23 10:00:00+00	2026-01-23 10:00:00+00	Tien mat	\N
HD025	25	26	2026-03-06	100000.00	233000.00	333000.00	Chua thanh toan	2026-03-06 10:00:00+00	2026-03-06 10:00:00+00	Tien mat	\N
HD026	26	21	2026-02-07	100000.00	395000.00	495000.00	Da thanh toan	2026-02-07 10:00:00+00	2026-02-07 10:00:00+00	Tien mat	\N
HD027	27	28	2026-01-12	100000.00	72000.00	172000.00	Chua thanh toan	2026-01-12 10:00:00+00	2026-01-12 10:00:00+00	Tien mat	\N
HD028	28	20	2026-02-21	100000.00	375000.00	475000.00	Chua thanh toan	2026-02-21 10:00:00+00	2026-02-21 10:00:00+00	Tien mat	\N
HD029	29	33	2026-01-29	100000.00	72000.00	172000.00	Chua thanh toan	2026-01-29 10:00:00+00	2026-01-29 10:00:00+00	Tien mat	\N
HD030	30	10	2026-02-14	100000.00	386000.00	486000.00	Chua thanh toan	2026-02-14 10:00:00+00	2026-02-14 10:00:00+00	Tien mat	\N
HD032	32	33	2026-04-12	100000.00	546000.00	646000.00	Chua thanh toan	2026-04-12 10:00:00+00	2026-04-12 10:00:00+00	Tien mat	\N
HD034	34	38	2026-03-18	100000.00	140000.00	240000.00	Da thanh toan	2026-03-18 10:00:00+00	2026-03-18 10:00:00+00	Tien mat	\N
HD035	35	10	2026-02-11	100000.00	434000.00	534000.00	Chua thanh toan	2026-02-11 10:00:00+00	2026-02-11 10:00:00+00	Tien mat	\N
HD036	36	46	2026-03-24	100000.00	400000.00	500000.00	Da thanh toan	2026-03-24 10:00:00+00	2026-03-24 10:00:00+00	Tien mat	\N
HD038	38	7	2026-04-12	100000.00	338000.00	438000.00	Chua thanh toan	2026-04-12 10:00:00+00	2026-04-12 10:00:00+00	Tien mat	\N
HD039	39	47	2026-03-28	100000.00	452000.00	552000.00	Da thanh toan	2026-03-28 10:00:00+00	2026-03-28 10:00:00+00	Tien mat	\N
HD040	40	38	2026-04-22	100000.00	165000.00	265000.00	Chua thanh toan	2026-04-22 10:00:00+00	2026-04-22 10:00:00+00	Tien mat	\N
HD042	42	20	2026-03-07	100000.00	39000.00	139000.00	Chua thanh toan	2026-03-07 10:00:00+00	2026-03-07 10:00:00+00	Tien mat	\N
HD043	43	15	2026-01-28	100000.00	12000.00	112000.00	Da thanh toan	2026-01-28 10:00:00+00	2026-01-28 10:00:00+00	Tien mat	\N
HD044	44	11	2026-01-17	100000.00	335000.00	435000.00	Da thanh toan	2026-01-17 10:00:00+00	2026-01-17 10:00:00+00	Tien mat	\N
HD046	46	16	2026-04-07	100000.00	210000.00	310000.00	Da thanh toan	2026-04-07 10:00:00+00	2026-04-07 10:00:00+00	Tien mat	\N
HD047	47	44	2026-04-14	100000.00	509000.00	609000.00	Da thanh toan	2026-04-14 10:00:00+00	2026-04-14 10:00:00+00	Tien mat	\N
HD048	48	6	2026-03-12	100000.00	210000.00	310000.00	Chua thanh toan	2026-03-12 10:00:00+00	2026-03-12 10:00:00+00	Tien mat	\N
HD049	49	25	2026-01-07	100000.00	339000.00	439000.00	Chua thanh toan	2026-01-07 10:00:00+00	2026-01-07 10:00:00+00	Tien mat	\N
HD050	50	7	2026-02-17	100000.00	164000.00	264000.00	Chua thanh toan	2026-02-17 10:00:00+00	2026-02-17 10:00:00+00	Tien mat	\N
HD051	51	19	2026-04-12	100000.00	96000.00	196000.00	Da thanh toan	2026-04-12 10:00:00+00	2026-04-12 10:00:00+00	Tien mat	\N
HD052	52	40	2026-03-31	100000.00	419000.00	519000.00	Chua thanh toan	2026-03-31 10:00:00+00	2026-03-31 10:00:00+00	Tien mat	\N
HD053	53	10	2026-01-11	100000.00	353000.00	453000.00	Chua thanh toan	2026-01-11 10:00:00+00	2026-01-11 10:00:00+00	Tien mat	\N
HD054	54	50	2026-04-04	100000.00	236000.00	336000.00	Chua thanh toan	2026-04-04 10:00:00+00	2026-04-04 10:00:00+00	Tien mat	\N
HD056	56	8	2026-03-23	100000.00	115000.00	215000.00	Chua thanh toan	2026-03-23 10:00:00+00	2026-03-23 10:00:00+00	Tien mat	\N
HD057	57	1	2026-01-31	100000.00	327000.00	427000.00	Chua thanh toan	2026-01-31 10:00:00+00	2026-01-31 10:00:00+00	Tien mat	\N
HD058	58	43	2026-02-15	100000.00	595000.00	695000.00	Da thanh toan	2026-02-15 10:00:00+00	2026-02-15 10:00:00+00	Tien mat	\N
HD060	60	31	2026-04-11	100000.00	110000.00	210000.00	Da thanh toan	2026-04-11 10:00:00+00	2026-04-11 10:00:00+00	Tien mat	\N
HD061	61	48	2026-03-23	100000.00	436000.00	536000.00	Chua thanh toan	2026-03-23 10:00:00+00	2026-03-23 10:00:00+00	Tien mat	\N
HD062	62	47	2026-02-15	100000.00	40000.00	140000.00	Da thanh toan	2026-02-15 10:00:00+00	2026-02-15 10:00:00+00	Tien mat	\N
HD063	63	3	2026-04-09	100000.00	420000.00	520000.00	Chua thanh toan	2026-04-09 10:00:00+00	2026-04-09 10:00:00+00	Tien mat	\N
HD064	64	13	2026-04-02	100000.00	90000.00	190000.00	Da thanh toan	2026-04-02 10:00:00+00	2026-04-02 10:00:00+00	Tien mat	\N
HD065	65	20	2026-04-12	100000.00	78000.00	178000.00	Chua thanh toan	2026-04-12 10:00:00+00	2026-04-12 10:00:00+00	Tien mat	\N
HD066	66	3	2026-02-20	100000.00	180000.00	280000.00	Da thanh toan	2026-02-20 10:00:00+00	2026-02-20 10:00:00+00	Tien mat	\N
HD067	67	26	2026-02-04	100000.00	388000.00	488000.00	Chua thanh toan	2026-02-04 10:00:00+00	2026-02-04 10:00:00+00	Tien mat	\N
HD068	68	45	2026-02-19	100000.00	54000.00	154000.00	Chua thanh toan	2026-02-19 10:00:00+00	2026-02-19 10:00:00+00	Tien mat	\N
HD069	69	19	2026-01-11	100000.00	200000.00	300000.00	Chua thanh toan	2026-01-11 10:00:00+00	2026-01-11 10:00:00+00	Tien mat	\N
HD070	70	45	2026-02-27	100000.00	30000.00	130000.00	Chua thanh toan	2026-02-27 10:00:00+00	2026-02-27 10:00:00+00	Tien mat	\N
HD072	72	10	2026-02-16	100000.00	180000.00	280000.00	Da thanh toan	2026-02-16 10:00:00+00	2026-02-16 10:00:00+00	Tien mat	\N
HD073	73	5	2026-03-28	100000.00	201000.00	301000.00	Da thanh toan	2026-03-28 10:00:00+00	2026-03-28 10:00:00+00	Tien mat	\N
HD074	74	37	2026-04-10	100000.00	408000.00	508000.00	Da thanh toan	2026-04-10 10:00:00+00	2026-04-10 10:00:00+00	Tien mat	\N
HD075	75	24	2026-03-19	100000.00	505000.00	605000.00	Chua thanh toan	2026-03-19 10:00:00+00	2026-03-19 10:00:00+00	Tien mat	\N
HD076	76	24	2026-04-08	100000.00	350000.00	450000.00	Da thanh toan	2026-04-08 10:00:00+00	2026-04-08 10:00:00+00	Tien mat	\N
HD077	77	2	2026-02-10	100000.00	204000.00	304000.00	Chua thanh toan	2026-02-10 10:00:00+00	2026-02-10 10:00:00+00	Tien mat	\N
HD078	78	40	2026-02-03	100000.00	360000.00	460000.00	Da thanh toan	2026-02-03 10:00:00+00	2026-02-03 10:00:00+00	Tien mat	\N
HD079	79	9	2026-03-30	100000.00	385000.00	485000.00	Chua thanh toan	2026-03-30 10:00:00+00	2026-03-30 10:00:00+00	Tien mat	\N
HD081	81	35	2026-03-27	100000.00	118000.00	218000.00	Da thanh toan	2026-03-27 10:00:00+00	2026-03-27 10:00:00+00	Tien mat	\N
\.


--
-- Data for Name: lich_hen; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lich_hen (id, benh_nhan_id, bac_si_id, ngay_hen, gio_hen, ly_do_kham, trang_thai, nguon_dat_lich, ghi_chu, ly_do_huy, thoi_gian_huy, thoi_gian_check_in, thoi_gian_bat_dau_kham, thoi_gian_ket_thuc_kham, ngay_tao, ngay_cap_nhat) FROM stdin;
1	12	3	2026-02-15	10:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-15 03:15:00+00	2026-02-15 03:30:00+00	2026-02-15 04:00:00+00	2026-02-08 03:30:00+00	2026-02-15 04:00:00+00
2	8	1	2026-01-07	09:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-07 02:15:00+00	2026-01-07 02:30:00+00	2026-01-07 03:00:00+00	2025-12-31 02:30:00+00	2026-01-07 03:00:00+00
3	38	1	2026-03-02	14:30:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-02 07:15:00+00	2026-03-02 07:30:00+00	2026-03-02 08:00:00+00	2026-02-23 07:30:00+00	2026-03-02 08:00:00+00
4	3	5	2026-02-27	15:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-27 07:45:00+00	2026-02-27 08:00:00+00	2026-02-27 08:30:00+00	2026-02-20 08:00:00+00	2026-02-27 08:30:00+00
5	31	4	2026-02-08	14:00:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-08 06:45:00+00	2026-02-08 07:00:00+00	2026-02-08 07:30:00+00	2026-02-01 07:00:00+00	2026-02-08 07:30:00+00
6	29	1	2026-02-24	08:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-17 01:30:00+00	2026-02-17 01:30:00+00
7	9	3	2026-01-11	12:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-11 04:45:00+00	2026-01-11 05:00:00+00	2026-01-11 05:30:00+00	2026-01-04 05:00:00+00	2026-01-11 05:30:00+00
8	39	5	2026-03-21	16:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-21 09:15:00+00	2026-03-21 09:30:00+00	2026-03-21 10:00:00+00	2026-03-14 09:30:00+00	2026-03-21 10:00:00+00
9	45	1	2026-02-07	14:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-07 07:15:00+00	2026-02-07 07:30:00+00	2026-02-07 08:00:00+00	2026-01-31 07:30:00+00	2026-02-07 08:00:00+00
10	29	2	2026-04-20	15:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-20 07:45:00+00	2026-04-20 08:00:00+00	2026-04-20 08:30:00+00	2026-04-13 08:00:00+00	2026-04-20 08:30:00+00
11	27	1	2026-02-22	12:30:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-22 05:15:00+00	2026-02-22 05:30:00+00	2026-02-22 06:00:00+00	2026-02-15 05:30:00+00	2026-02-22 06:00:00+00
12	17	3	2026-02-10	13:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-03 06:30:00+00	2026-02-03 06:30:00+00
13	6	1	2026-01-20	14:00:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-20 06:45:00+00	2026-01-20 07:00:00+00	2026-01-20 07:30:00+00	2026-01-13 07:00:00+00	2026-01-20 07:30:00+00
14	9	5	2026-02-25	08:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-18 01:30:00+00	2026-02-18 01:30:00+00
15	8	4	2026-01-08	16:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-01 09:30:00+00	2026-01-01 09:30:00+00
16	39	3	2026-02-15	13:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-15 05:45:00+00	2026-02-15 06:00:00+00	2026-02-15 06:30:00+00	2026-02-08 06:00:00+00	2026-02-15 06:30:00+00
17	43	4	2026-02-15	08:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-15 00:45:00+00	2026-02-15 01:00:00+00	2026-02-15 01:30:00+00	2026-02-08 01:00:00+00	2026-02-15 01:30:00+00
18	36	3	2026-01-29	08:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-01-28 01:30:00+00	\N	\N	\N	2026-01-22 01:30:00+00	2026-01-28 01:30:00+00
19	28	5	2026-01-15	11:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-08 04:00:00+00	2026-01-08 04:00:00+00
20	43	3	2026-04-09	16:00:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-09 08:45:00+00	2026-04-09 09:00:00+00	2026-04-09 09:30:00+00	2026-04-02 09:00:00+00	2026-04-09 09:30:00+00
21	49	3	2026-01-04	09:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2025-12-28 02:30:00+00	2025-12-28 02:30:00+00
22	10	5	2026-02-13	12:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-13 04:45:00+00	2026-02-13 05:00:00+00	2026-02-13 05:30:00+00	2026-02-06 05:00:00+00	2026-02-13 05:30:00+00
23	48	1	2026-03-26	13:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-26 05:45:00+00	2026-03-26 06:00:00+00	2026-03-26 06:30:00+00	2026-03-19 06:00:00+00	2026-03-26 06:30:00+00
24	27	4	2026-01-12	15:00:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-12 07:45:00+00	2026-01-12 08:00:00+00	2026-01-12 08:30:00+00	2026-01-05 08:00:00+00	2026-01-12 08:30:00+00
25	47	3	2026-02-13	09:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-13 02:15:00+00	2026-02-13 02:30:00+00	2026-02-13 03:00:00+00	2026-02-06 02:30:00+00	2026-02-13 03:00:00+00
26	4	2	2026-04-10	16:00:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-04-09 09:00:00+00	\N	\N	\N	2026-04-03 09:00:00+00	2026-04-09 09:00:00+00
27	6	3	2026-01-21	16:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-14 09:00:00+00	2026-01-14 09:00:00+00
28	29	4	2026-02-26	13:30:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-26 06:15:00+00	2026-02-26 06:30:00+00	2026-02-26 07:00:00+00	2026-02-19 06:30:00+00	2026-02-26 07:00:00+00
29	28	1	2026-02-04	10:00:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-04 02:45:00+00	2026-02-04 03:00:00+00	2026-02-04 03:30:00+00	2026-01-28 03:00:00+00	2026-02-04 03:30:00+00
30	43	3	2026-02-06	16:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-06 09:15:00+00	2026-02-06 09:30:00+00	2026-02-06 10:00:00+00	2026-01-30 09:30:00+00	2026-02-06 10:00:00+00
31	4	1	2026-01-06	10:30:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-06 03:15:00+00	2026-01-06 03:30:00+00	2026-01-06 04:00:00+00	2025-12-30 03:30:00+00	2026-01-06 04:00:00+00
32	9	3	2026-01-27	11:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-20 04:00:00+00	2026-01-20 04:00:00+00
33	32	4	2026-02-07	12:00:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-07 04:45:00+00	2026-02-07 05:00:00+00	2026-02-07 05:30:00+00	2026-01-31 05:00:00+00	2026-02-07 05:30:00+00
34	46	2	2026-01-23	09:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-23 02:15:00+00	2026-01-23 02:30:00+00	2026-01-23 03:00:00+00	2026-01-16 02:30:00+00	2026-01-23 03:00:00+00
35	26	1	2026-03-06	15:30:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-06 08:15:00+00	2026-03-06 08:30:00+00	2026-03-06 09:00:00+00	2026-02-27 08:30:00+00	2026-03-06 09:00:00+00
36	5	3	2026-02-25	07:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-02-24 00:30:00+00	\N	\N	\N	2026-02-18 00:30:00+00	2026-02-24 00:30:00+00
37	41	4	2026-03-15	13:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-03-08 06:30:00+00	2026-03-08 06:30:00+00
38	21	2	2026-02-07	08:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-07 01:15:00+00	2026-02-07 01:30:00+00	2026-02-07 02:00:00+00	2026-01-31 01:30:00+00	2026-02-07 02:00:00+00
39	45	3	2026-04-13	16:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-04-12 09:30:00+00	\N	\N	\N	2026-04-06 09:30:00+00	2026-04-12 09:30:00+00
40	28	5	2026-01-12	13:00:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-12 05:45:00+00	2026-01-12 06:00:00+00	2026-01-12 06:30:00+00	2026-01-05 06:00:00+00	2026-01-12 06:30:00+00
41	20	3	2026-02-21	15:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-21 07:45:00+00	2026-02-21 08:00:00+00	2026-02-21 08:30:00+00	2026-02-14 08:00:00+00	2026-02-21 08:30:00+00
42	33	1	2026-01-29	12:00:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-29 04:45:00+00	2026-01-29 05:00:00+00	2026-01-29 05:30:00+00	2026-01-22 05:00:00+00	2026-01-29 05:30:00+00
43	50	3	2026-03-09	15:00:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-03-08 08:00:00+00	\N	\N	\N	2026-03-02 08:00:00+00	2026-03-08 08:00:00+00
44	10	3	2026-02-14	09:00:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-14 01:45:00+00	2026-02-14 02:00:00+00	2026-02-14 02:30:00+00	2026-02-07 02:00:00+00	2026-02-14 02:30:00+00
45	49	1	2026-01-26	09:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-19 02:00:00+00	2026-01-19 02:00:00+00
46	37	5	2026-01-23	14:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-16 07:30:00+00	2026-01-16 07:30:00+00
47	41	3	2026-02-27	16:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-02-26 09:30:00+00	\N	\N	\N	2026-02-20 09:30:00+00	2026-02-26 09:30:00+00
48	29	3	2026-01-20	14:00:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-20 06:45:00+00	2026-01-20 07:00:00+00	2026-01-20 07:30:00+00	2026-01-13 07:00:00+00	2026-01-20 07:30:00+00
49	33	1	2026-04-12	11:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-12 03:45:00+00	2026-04-12 04:00:00+00	2026-04-12 04:30:00+00	2026-04-05 04:00:00+00	2026-04-12 04:30:00+00
50	4	3	2026-02-09	14:30:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-09 07:15:00+00	2026-02-09 07:30:00+00	2026-02-09 08:00:00+00	2026-02-02 07:30:00+00	2026-02-09 08:00:00+00
51	6	5	2026-04-17	11:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-04-10 04:00:00+00	2026-04-10 04:00:00+00
52	38	5	2026-03-18	15:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-18 08:15:00+00	2026-03-18 08:30:00+00	2026-03-18 09:00:00+00	2026-03-11 08:30:00+00	2026-03-18 09:00:00+00
53	37	2	2026-04-12	07:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-04-11 00:30:00+00	\N	\N	\N	2026-04-05 00:30:00+00	2026-04-11 00:30:00+00
54	10	1	2026-02-11	16:30:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-11 09:15:00+00	2026-02-11 09:30:00+00	2026-02-11 10:00:00+00	2026-02-04 09:30:00+00	2026-02-11 10:00:00+00
55	6	5	2026-02-27	08:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-20 01:30:00+00	2026-02-20 01:30:00+00
56	46	4	2026-03-24	09:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-24 01:45:00+00	2026-03-24 02:00:00+00	2026-03-24 02:30:00+00	2026-03-17 02:00:00+00	2026-03-24 02:30:00+00
57	24	3	2026-02-26	15:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-26 07:45:00+00	2026-02-26 08:00:00+00	2026-02-26 08:30:00+00	2026-02-19 08:00:00+00	2026-02-26 08:30:00+00
58	39	1	2026-02-19	13:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-12 06:30:00+00	2026-02-12 06:30:00+00
59	7	5	2026-04-12	12:00:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-12 04:45:00+00	2026-04-12 05:00:00+00	2026-04-12 05:30:00+00	2026-04-05 05:00:00+00	2026-04-12 05:30:00+00
60	47	5	2026-03-28	13:30:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-28 06:15:00+00	2026-03-28 06:30:00+00	2026-03-28 07:00:00+00	2026-03-21 06:30:00+00	2026-03-28 07:00:00+00
61	38	2	2026-04-22	09:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-22 02:15:00+00	2026-04-22 02:30:00+00	2026-04-22 03:00:00+00	2026-04-15 02:30:00+00	2026-04-22 03:00:00+00
62	39	1	2026-02-14	11:30:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-14 04:15:00+00	2026-02-14 04:30:00+00	2026-02-14 05:00:00+00	2026-02-07 04:30:00+00	2026-02-14 05:00:00+00
63	22	2	2026-02-09	15:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-02 08:30:00+00	2026-02-02 08:30:00+00
64	43	4	2026-03-27	15:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-03-20 08:00:00+00	2026-03-20 08:00:00+00
65	20	2	2026-03-07	12:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-07 04:45:00+00	2026-03-07 05:00:00+00	2026-03-07 05:30:00+00	2026-02-28 05:00:00+00	2026-03-07 05:30:00+00
66	15	2	2026-01-28	12:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-28 05:15:00+00	2026-01-28 05:30:00+00	2026-01-28 06:00:00+00	2026-01-21 05:30:00+00	2026-01-28 06:00:00+00
67	7	5	2026-01-20	08:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-01-19 01:30:00+00	\N	\N	\N	2026-01-13 01:30:00+00	2026-01-19 01:30:00+00
68	22	5	2026-04-09	15:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-04-02 08:00:00+00	2026-04-02 08:00:00+00
69	11	2	2026-01-17	16:30:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-17 09:15:00+00	2026-01-17 09:30:00+00	2026-01-17 10:00:00+00	2026-01-10 09:30:00+00	2026-01-17 10:00:00+00
70	29	1	2026-04-17	16:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-04-10 09:00:00+00	2026-04-10 09:00:00+00
71	40	3	2026-02-22	12:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-22 04:45:00+00	2026-02-22 05:00:00+00	2026-02-22 05:30:00+00	2026-02-15 05:00:00+00	2026-02-22 05:30:00+00
72	16	3	2026-04-07	14:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-07 06:45:00+00	2026-04-07 07:00:00+00	2026-04-07 07:30:00+00	2026-03-31 07:00:00+00	2026-04-07 07:30:00+00
73	44	5	2026-04-14	14:00:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-14 06:45:00+00	2026-04-14 07:00:00+00	2026-04-14 07:30:00+00	2026-04-07 07:00:00+00	2026-04-14 07:30:00+00
74	25	5	2026-02-26	14:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-19 07:30:00+00	2026-02-19 07:30:00+00
75	13	5	2026-03-09	13:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-03-02 06:00:00+00	2026-03-02 06:00:00+00
76	31	3	2026-01-18	11:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-11 04:00:00+00	2026-01-11 04:00:00+00
77	6	2	2026-03-12	08:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-12 00:45:00+00	2026-03-12 01:00:00+00	2026-03-12 01:30:00+00	2026-03-05 01:00:00+00	2026-03-12 01:30:00+00
78	28	1	2026-02-04	14:00:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-02-03 07:00:00+00	\N	\N	\N	2026-01-28 07:00:00+00	2026-02-03 07:00:00+00
79	2	4	2026-01-29	14:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-01-28 07:30:00+00	\N	\N	\N	2026-01-22 07:30:00+00	2026-01-28 07:30:00+00
80	25	1	2026-01-07	13:30:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-07 06:15:00+00	2026-01-07 06:30:00+00	2026-01-07 07:00:00+00	2025-12-31 06:30:00+00	2026-01-07 07:00:00+00
81	7	3	2026-02-17	10:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-17 02:45:00+00	2026-02-17 03:00:00+00	2026-02-17 03:30:00+00	2026-02-10 03:00:00+00	2026-02-17 03:30:00+00
82	19	4	2026-04-12	09:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-12 01:45:00+00	2026-04-12 02:00:00+00	2026-04-12 02:30:00+00	2026-04-05 02:00:00+00	2026-04-12 02:30:00+00
83	40	1	2026-03-31	09:30:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-31 02:15:00+00	2026-03-31 02:30:00+00	2026-03-31 03:00:00+00	2026-03-24 02:30:00+00	2026-03-31 03:00:00+00
84	10	5	2026-01-11	07:30:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-11 00:15:00+00	2026-01-11 00:30:00+00	2026-01-11 01:00:00+00	2026-01-04 00:30:00+00	2026-01-11 01:00:00+00
85	50	3	2026-04-04	16:30:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-04 09:15:00+00	2026-04-04 09:30:00+00	2026-04-04 10:00:00+00	2026-03-28 09:30:00+00	2026-04-04 10:00:00+00
86	16	4	2026-01-31	11:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-31 03:45:00+00	2026-01-31 04:00:00+00	2026-01-31 04:30:00+00	2026-01-24 04:00:00+00	2026-01-31 04:30:00+00
87	8	4	2026-03-23	16:30:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-23 09:15:00+00	2026-03-23 09:30:00+00	2026-03-23 10:00:00+00	2026-03-16 09:30:00+00	2026-03-23 10:00:00+00
88	33	5	2026-03-18	15:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-03-11 08:00:00+00	2026-03-11 08:00:00+00
89	1	5	2026-01-31	09:30:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-31 02:15:00+00	2026-01-31 02:30:00+00	2026-01-31 03:00:00+00	2026-01-24 02:30:00+00	2026-01-31 03:00:00+00
90	43	1	2026-02-15	10:30:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-15 03:15:00+00	2026-02-15 03:30:00+00	2026-02-15 04:00:00+00	2026-02-08 03:30:00+00	2026-02-15 04:00:00+00
91	35	5	2026-03-09	12:00:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-09 04:45:00+00	2026-03-09 05:00:00+00	2026-03-09 05:30:00+00	2026-03-02 05:00:00+00	2026-03-09 05:30:00+00
92	31	1	2026-04-11	15:00:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-11 07:45:00+00	2026-04-11 08:00:00+00	2026-04-11 08:30:00+00	2026-04-04 08:00:00+00	2026-04-11 08:30:00+00
93	48	1	2026-03-23	13:30:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-23 06:15:00+00	2026-03-23 06:30:00+00	2026-03-23 07:00:00+00	2026-03-16 06:30:00+00	2026-03-23 07:00:00+00
94	47	1	2026-02-15	08:30:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-15 01:15:00+00	2026-02-15 01:30:00+00	2026-02-15 02:00:00+00	2026-02-08 01:30:00+00	2026-02-15 02:00:00+00
95	3	3	2026-04-09	16:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-09 09:15:00+00	2026-04-09 09:30:00+00	2026-04-09 10:00:00+00	2026-04-02 09:30:00+00	2026-04-09 10:00:00+00
96	50	4	2026-03-11	12:00:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-03-10 05:00:00+00	\N	\N	\N	2026-03-04 05:00:00+00	2026-03-10 05:00:00+00
97	9	1	2026-03-31	14:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-03-24 07:00:00+00	2026-03-24 07:00:00+00
98	13	1	2026-04-02	14:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-02 06:45:00+00	2026-04-02 07:00:00+00	2026-04-02 07:30:00+00	2026-03-26 07:00:00+00	2026-04-02 07:30:00+00
99	20	5	2026-04-12	10:00:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-12 02:45:00+00	2026-04-12 03:00:00+00	2026-04-12 03:30:00+00	2026-04-05 03:00:00+00	2026-04-12 03:30:00+00
100	3	2	2026-02-20	15:30:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-20 08:15:00+00	2026-02-20 08:30:00+00	2026-02-20 09:00:00+00	2026-02-13 08:30:00+00	2026-02-20 09:00:00+00
101	42	3	2026-02-06	12:00:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-02-05 05:00:00+00	\N	\N	\N	2026-01-30 05:00:00+00	2026-02-05 05:00:00+00
102	26	4	2026-02-04	08:30:00	Dau dau, sot nhe	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-04 01:15:00+00	2026-02-04 01:30:00+00	2026-02-04 02:00:00+00	2026-01-28 01:30:00+00	2026-02-04 02:00:00+00
103	45	4	2026-02-19	12:00:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-19 04:45:00+00	2026-02-19 05:00:00+00	2026-02-19 05:30:00+00	2026-02-12 05:00:00+00	2026-02-19 05:30:00+00
104	6	4	2026-02-17	15:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-10 08:30:00+00	2026-02-10 08:30:00+00
105	19	3	2026-01-11	13:00:00	Dau nguc, hoi hop	Hoan thanh	Truc tuyen	\N	\N	\N	2026-01-11 05:45:00+00	2026-01-11 06:00:00+00	2026-01-11 06:30:00+00	2026-01-04 06:00:00+00	2026-01-11 06:30:00+00
106	19	3	2026-01-14	08:30:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-01-07 01:30:00+00	2026-01-07 01:30:00+00
107	45	4	2026-02-27	16:30:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-27 09:15:00+00	2026-02-27 09:30:00+00	2026-02-27 10:00:00+00	2026-02-20 09:30:00+00	2026-02-27 10:00:00+00
108	23	5	2026-02-14	14:00:00	Kham tong quat	Da xac nhan	Truc tuyen	\N	\N	\N	\N	\N	\N	2026-02-07 07:00:00+00	2026-02-07 07:00:00+00
109	43	4	2026-02-25	11:00:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-25 03:45:00+00	2026-02-25 04:00:00+00	2026-02-25 04:30:00+00	2026-02-18 04:00:00+00	2026-02-25 04:30:00+00
110	10	5	2026-02-16	15:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-16 07:45:00+00	2026-02-16 08:00:00+00	2026-02-16 08:30:00+00	2026-02-09 08:00:00+00	2026-02-16 08:30:00+00
111	5	2	2026-03-28	14:00:00	Dau khop, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-28 06:45:00+00	2026-03-28 07:00:00+00	2026-03-28 07:30:00+00	2026-03-21 07:00:00+00	2026-03-28 07:30:00+00
112	37	1	2026-04-10	12:30:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-10 05:15:00+00	2026-04-10 05:30:00+00	2026-04-10 06:00:00+00	2026-04-03 05:30:00+00	2026-04-10 06:00:00+00
113	24	4	2026-03-19	09:30:00	Ho, sot, met moi	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-19 02:15:00+00	2026-03-19 02:30:00+00	2026-03-19 03:00:00+00	2026-03-12 02:30:00+00	2026-03-19 03:00:00+00
114	24	4	2026-04-08	08:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-04-08 00:45:00+00	2026-04-08 01:00:00+00	2026-04-08 01:30:00+00	2026-04-01 01:00:00+00	2026-04-08 01:30:00+00
115	2	2	2026-02-10	11:00:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-10 03:45:00+00	2026-02-10 04:00:00+00	2026-02-10 04:30:00+00	2026-02-03 04:00:00+00	2026-02-10 04:30:00+00
116	36	1	2026-03-05	15:30:00	Kham tong quat	Huy	Truc tuyen	\N	Benh nhan huy lich	2026-03-04 08:30:00+00	\N	\N	\N	2026-02-26 08:30:00+00	2026-03-04 08:30:00+00
117	40	3	2026-02-03	11:30:00	Kho tho, ho khan	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-03 04:15:00+00	2026-02-03 04:30:00+00	2026-02-03 05:00:00+00	2026-01-27 04:30:00+00	2026-02-03 05:00:00+00
118	9	1	2026-03-30	14:00:00	Noi man ngua	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-30 06:45:00+00	2026-03-30 07:00:00+00	2026-03-30 07:30:00+00	2026-03-23 07:00:00+00	2026-03-30 07:30:00+00
119	44	3	2026-02-27	09:30:00	Dau bung, buon non	Hoan thanh	Truc tuyen	\N	\N	\N	2026-02-27 02:15:00+00	2026-02-27 02:30:00+00	2026-02-27 03:00:00+00	2026-02-20 02:30:00+00	2026-02-27 03:00:00+00
120	35	3	2026-03-27	12:00:00	Dau hong, nghen mui	Hoan thanh	Truc tuyen	\N	\N	\N	2026-03-27 04:45:00+00	2026-03-27 05:00:00+00	2026-03-27 05:30:00+00	2026-03-20 05:00:00+00	2026-03-27 05:30:00+00
\.


--
-- Data for Name: lich_lam_viec; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lich_lam_viec (id, bac_si_id, ngay_lam_viec, gio_bat_dau, gio_ket_thuc, thoi_luong_moi_ca, trang_thai, ghi_chu, ngay_tao, ngay_cap_nhat) FROM stdin;
1	1	2026-01-06	07:00:00	17:30:00	30	Active	\N	2026-01-05 23:30:00+00	2026-01-05 23:30:00+00
2	1	2026-01-07	07:00:00	17:30:00	30	Active	\N	2026-01-06 23:30:00+00	2026-01-06 23:30:00+00
3	1	2026-01-20	07:00:00	17:30:00	30	Active	\N	2026-01-19 23:30:00+00	2026-01-19 23:30:00+00
4	1	2026-01-26	07:00:00	17:30:00	30	Active	\N	2026-01-25 23:30:00+00	2026-01-25 23:30:00+00
5	1	2026-01-29	07:00:00	17:30:00	30	Active	\N	2026-01-28 23:30:00+00	2026-01-28 23:30:00+00
6	1	2026-02-04	07:00:00	17:30:00	30	Active	\N	2026-02-03 23:30:00+00	2026-02-03 23:30:00+00
7	1	2026-02-07	07:00:00	17:30:00	30	Active	\N	2026-02-06 23:30:00+00	2026-02-06 23:30:00+00
8	1	2026-02-11	07:00:00	17:30:00	30	Active	\N	2026-02-10 23:30:00+00	2026-02-10 23:30:00+00
9	1	2026-02-14	07:00:00	17:30:00	30	Active	\N	2026-02-13 23:30:00+00	2026-02-13 23:30:00+00
10	1	2026-02-15	07:00:00	17:30:00	30	Active	\N	2026-02-14 23:30:00+00	2026-02-14 23:30:00+00
11	1	2026-02-19	07:00:00	17:30:00	30	Active	\N	2026-02-18 23:30:00+00	2026-02-18 23:30:00+00
12	1	2026-02-22	07:00:00	17:30:00	30	Active	\N	2026-02-21 23:30:00+00	2026-02-21 23:30:00+00
13	1	2026-02-24	07:00:00	17:30:00	30	Active	\N	2026-02-23 23:30:00+00	2026-02-23 23:30:00+00
14	1	2026-03-02	07:00:00	17:30:00	30	Active	\N	2026-03-01 23:30:00+00	2026-03-01 23:30:00+00
15	1	2026-03-05	07:00:00	17:30:00	30	Active	\N	2026-03-04 23:30:00+00	2026-03-04 23:30:00+00
16	1	2026-03-06	07:00:00	17:30:00	30	Active	\N	2026-03-05 23:30:00+00	2026-03-05 23:30:00+00
17	1	2026-03-23	07:00:00	17:30:00	30	Active	\N	2026-03-22 23:30:00+00	2026-03-22 23:30:00+00
18	1	2026-03-26	07:00:00	17:30:00	30	Active	\N	2026-03-25 23:30:00+00	2026-03-25 23:30:00+00
19	1	2026-03-30	07:00:00	17:30:00	30	Active	\N	2026-03-29 23:30:00+00	2026-03-29 23:30:00+00
20	1	2026-03-31	07:00:00	17:30:00	30	Active	\N	2026-03-30 23:30:00+00	2026-03-30 23:30:00+00
21	1	2026-04-02	07:00:00	17:30:00	30	Active	\N	2026-04-01 23:30:00+00	2026-04-01 23:30:00+00
22	1	2026-04-10	07:00:00	17:30:00	30	Active	\N	2026-04-09 23:30:00+00	2026-04-09 23:30:00+00
23	1	2026-04-11	07:00:00	17:30:00	30	Active	\N	2026-04-10 23:30:00+00	2026-04-10 23:30:00+00
24	1	2026-04-12	07:00:00	17:30:00	30	Active	\N	2026-04-11 23:30:00+00	2026-04-11 23:30:00+00
25	1	2026-04-17	07:00:00	17:30:00	30	Active	\N	2026-04-16 23:30:00+00	2026-04-16 23:30:00+00
26	2	2026-01-17	07:00:00	17:30:00	30	Active	\N	2026-01-16 23:30:00+00	2026-01-16 23:30:00+00
27	2	2026-01-23	07:00:00	17:30:00	30	Active	\N	2026-01-22 23:30:00+00	2026-01-22 23:30:00+00
28	2	2026-01-28	07:00:00	17:30:00	30	Active	\N	2026-01-27 23:30:00+00	2026-01-27 23:30:00+00
29	2	2026-02-07	07:00:00	17:30:00	30	Active	\N	2026-02-06 23:30:00+00	2026-02-06 23:30:00+00
30	2	2026-02-09	07:00:00	17:30:00	30	Active	\N	2026-02-08 23:30:00+00	2026-02-08 23:30:00+00
31	2	2026-02-10	07:00:00	17:30:00	30	Active	\N	2026-02-09 23:30:00+00	2026-02-09 23:30:00+00
32	2	2026-02-20	07:00:00	17:30:00	30	Active	\N	2026-02-19 23:30:00+00	2026-02-19 23:30:00+00
33	2	2026-03-07	07:00:00	17:30:00	30	Active	\N	2026-03-06 23:30:00+00	2026-03-06 23:30:00+00
34	2	2026-03-12	07:00:00	17:30:00	30	Active	\N	2026-03-11 23:30:00+00	2026-03-11 23:30:00+00
35	2	2026-03-28	07:00:00	17:30:00	30	Active	\N	2026-03-27 23:30:00+00	2026-03-27 23:30:00+00
36	2	2026-04-10	07:00:00	17:30:00	30	Active	\N	2026-04-09 23:30:00+00	2026-04-09 23:30:00+00
37	2	2026-04-12	07:00:00	17:30:00	30	Active	\N	2026-04-11 23:30:00+00	2026-04-11 23:30:00+00
38	2	2026-04-20	07:00:00	17:30:00	30	Active	\N	2026-04-19 23:30:00+00	2026-04-19 23:30:00+00
39	2	2026-04-22	07:00:00	17:30:00	30	Active	\N	2026-04-21 23:30:00+00	2026-04-21 23:30:00+00
40	3	2026-01-04	07:00:00	17:30:00	30	Active	\N	2026-01-03 23:30:00+00	2026-01-03 23:30:00+00
41	3	2026-01-11	07:00:00	17:30:00	30	Active	\N	2026-01-10 23:30:00+00	2026-01-10 23:30:00+00
42	3	2026-01-14	07:00:00	17:30:00	30	Active	\N	2026-01-13 23:30:00+00	2026-01-13 23:30:00+00
43	3	2026-01-18	07:00:00	17:30:00	30	Active	\N	2026-01-17 23:30:00+00	2026-01-17 23:30:00+00
44	3	2026-01-20	07:00:00	17:30:00	30	Active	\N	2026-01-19 23:30:00+00	2026-01-19 23:30:00+00
45	3	2026-01-21	07:00:00	17:30:00	30	Active	\N	2026-01-20 23:30:00+00	2026-01-20 23:30:00+00
46	3	2026-01-27	07:00:00	17:30:00	30	Active	\N	2026-01-26 23:30:00+00	2026-01-26 23:30:00+00
47	3	2026-01-29	07:00:00	17:30:00	30	Active	\N	2026-01-28 23:30:00+00	2026-01-28 23:30:00+00
48	3	2026-02-03	07:00:00	17:30:00	30	Active	\N	2026-02-02 23:30:00+00	2026-02-02 23:30:00+00
49	3	2026-02-06	07:00:00	17:30:00	30	Active	\N	2026-02-05 23:30:00+00	2026-02-05 23:30:00+00
50	3	2026-02-09	07:00:00	17:30:00	30	Active	\N	2026-02-08 23:30:00+00	2026-02-08 23:30:00+00
51	3	2026-02-10	07:00:00	17:30:00	30	Active	\N	2026-02-09 23:30:00+00	2026-02-09 23:30:00+00
52	3	2026-02-13	07:00:00	17:30:00	30	Active	\N	2026-02-12 23:30:00+00	2026-02-12 23:30:00+00
53	3	2026-02-14	07:00:00	17:30:00	30	Active	\N	2026-02-13 23:30:00+00	2026-02-13 23:30:00+00
54	3	2026-02-15	07:00:00	17:30:00	30	Active	\N	2026-02-14 23:30:00+00	2026-02-14 23:30:00+00
55	3	2026-02-17	07:00:00	17:30:00	30	Active	\N	2026-02-16 23:30:00+00	2026-02-16 23:30:00+00
56	3	2026-02-21	07:00:00	17:30:00	30	Active	\N	2026-02-20 23:30:00+00	2026-02-20 23:30:00+00
57	3	2026-02-22	07:00:00	17:30:00	30	Active	\N	2026-02-21 23:30:00+00	2026-02-21 23:30:00+00
58	3	2026-02-25	07:00:00	17:30:00	30	Active	\N	2026-02-24 23:30:00+00	2026-02-24 23:30:00+00
59	3	2026-02-26	07:00:00	17:30:00	30	Active	\N	2026-02-25 23:30:00+00	2026-02-25 23:30:00+00
60	3	2026-02-27	07:00:00	17:30:00	30	Active	\N	2026-02-26 23:30:00+00	2026-02-26 23:30:00+00
61	3	2026-03-09	07:00:00	17:30:00	30	Active	\N	2026-03-08 23:30:00+00	2026-03-08 23:30:00+00
62	3	2026-03-27	07:00:00	17:30:00	30	Active	\N	2026-03-26 23:30:00+00	2026-03-26 23:30:00+00
63	3	2026-04-04	07:00:00	17:30:00	30	Active	\N	2026-04-03 23:30:00+00	2026-04-03 23:30:00+00
64	3	2026-04-07	07:00:00	17:30:00	30	Active	\N	2026-04-06 23:30:00+00	2026-04-06 23:30:00+00
65	3	2026-04-09	07:00:00	17:30:00	30	Active	\N	2026-04-08 23:30:00+00	2026-04-08 23:30:00+00
66	3	2026-04-13	07:00:00	17:30:00	30	Active	\N	2026-04-12 23:30:00+00	2026-04-12 23:30:00+00
67	4	2026-01-08	07:00:00	17:30:00	30	Active	\N	2026-01-07 23:30:00+00	2026-01-07 23:30:00+00
68	4	2026-01-12	07:00:00	17:30:00	30	Active	\N	2026-01-11 23:30:00+00	2026-01-11 23:30:00+00
69	4	2026-01-29	07:00:00	17:30:00	30	Active	\N	2026-01-28 23:30:00+00	2026-01-28 23:30:00+00
70	4	2026-01-31	07:00:00	17:30:00	30	Active	\N	2026-01-30 23:30:00+00	2026-01-30 23:30:00+00
71	4	2026-02-04	07:00:00	17:30:00	30	Active	\N	2026-02-03 23:30:00+00	2026-02-03 23:30:00+00
72	4	2026-02-07	07:00:00	17:30:00	30	Active	\N	2026-02-06 23:30:00+00	2026-02-06 23:30:00+00
73	4	2026-02-08	07:00:00	17:30:00	30	Active	\N	2026-02-07 23:30:00+00	2026-02-07 23:30:00+00
74	4	2026-02-15	07:00:00	17:30:00	30	Active	\N	2026-02-14 23:30:00+00	2026-02-14 23:30:00+00
75	4	2026-02-17	07:00:00	17:30:00	30	Active	\N	2026-02-16 23:30:00+00	2026-02-16 23:30:00+00
76	4	2026-02-19	07:00:00	17:30:00	30	Active	\N	2026-02-18 23:30:00+00	2026-02-18 23:30:00+00
77	4	2026-02-25	07:00:00	17:30:00	30	Active	\N	2026-02-24 23:30:00+00	2026-02-24 23:30:00+00
78	4	2026-02-26	07:00:00	17:30:00	30	Active	\N	2026-02-25 23:30:00+00	2026-02-25 23:30:00+00
79	4	2026-02-27	07:00:00	17:30:00	30	Active	\N	2026-02-26 23:30:00+00	2026-02-26 23:30:00+00
80	4	2026-03-11	07:00:00	17:30:00	30	Active	\N	2026-03-10 23:30:00+00	2026-03-10 23:30:00+00
81	4	2026-03-15	07:00:00	17:30:00	30	Active	\N	2026-03-14 23:30:00+00	2026-03-14 23:30:00+00
82	4	2026-03-19	07:00:00	17:30:00	30	Active	\N	2026-03-18 23:30:00+00	2026-03-18 23:30:00+00
83	4	2026-03-23	07:00:00	17:30:00	30	Active	\N	2026-03-22 23:30:00+00	2026-03-22 23:30:00+00
84	4	2026-03-24	07:00:00	17:30:00	30	Active	\N	2026-03-23 23:30:00+00	2026-03-23 23:30:00+00
85	4	2026-03-27	07:00:00	17:30:00	30	Active	\N	2026-03-26 23:30:00+00	2026-03-26 23:30:00+00
86	4	2026-04-08	07:00:00	17:30:00	30	Active	\N	2026-04-07 23:30:00+00	2026-04-07 23:30:00+00
87	4	2026-04-12	07:00:00	17:30:00	30	Active	\N	2026-04-11 23:30:00+00	2026-04-11 23:30:00+00
88	5	2026-01-11	07:00:00	17:30:00	30	Active	\N	2026-01-10 23:30:00+00	2026-01-10 23:30:00+00
89	5	2026-01-12	07:00:00	17:30:00	30	Active	\N	2026-01-11 23:30:00+00	2026-01-11 23:30:00+00
90	5	2026-01-15	07:00:00	17:30:00	30	Active	\N	2026-01-14 23:30:00+00	2026-01-14 23:30:00+00
91	5	2026-01-20	07:00:00	17:30:00	30	Active	\N	2026-01-19 23:30:00+00	2026-01-19 23:30:00+00
92	5	2026-01-23	07:00:00	17:30:00	30	Active	\N	2026-01-22 23:30:00+00	2026-01-22 23:30:00+00
93	5	2026-01-31	07:00:00	17:30:00	30	Active	\N	2026-01-30 23:30:00+00	2026-01-30 23:30:00+00
94	5	2026-02-13	07:00:00	17:30:00	30	Active	\N	2026-02-12 23:30:00+00	2026-02-12 23:30:00+00
95	5	2026-02-14	07:00:00	17:30:00	30	Active	\N	2026-02-13 23:30:00+00	2026-02-13 23:30:00+00
96	5	2026-02-16	07:00:00	17:30:00	30	Active	\N	2026-02-15 23:30:00+00	2026-02-15 23:30:00+00
97	5	2026-02-25	07:00:00	17:30:00	30	Active	\N	2026-02-24 23:30:00+00	2026-02-24 23:30:00+00
98	5	2026-02-26	07:00:00	17:30:00	30	Active	\N	2026-02-25 23:30:00+00	2026-02-25 23:30:00+00
99	5	2026-02-27	07:00:00	17:30:00	30	Active	\N	2026-02-26 23:30:00+00	2026-02-26 23:30:00+00
100	5	2026-03-09	07:00:00	17:30:00	30	Active	\N	2026-03-08 23:30:00+00	2026-03-08 23:30:00+00
101	5	2026-03-18	07:00:00	17:30:00	30	Active	\N	2026-03-17 23:30:00+00	2026-03-17 23:30:00+00
102	5	2026-03-21	07:00:00	17:30:00	30	Active	\N	2026-03-20 23:30:00+00	2026-03-20 23:30:00+00
103	5	2026-03-28	07:00:00	17:30:00	30	Active	\N	2026-03-27 23:30:00+00	2026-03-27 23:30:00+00
104	5	2026-04-09	07:00:00	17:30:00	30	Active	\N	2026-04-08 23:30:00+00	2026-04-08 23:30:00+00
105	5	2026-04-12	07:00:00	17:30:00	30	Active	\N	2026-04-11 23:30:00+00	2026-04-11 23:30:00+00
106	5	2026-04-14	07:00:00	17:30:00	30	Active	\N	2026-04-13 23:30:00+00	2026-04-13 23:30:00+00
107	5	2026-04-17	07:00:00	17:30:00	30	Active	\N	2026-04-16 23:30:00+00	2026-04-16 23:30:00+00
\.


--
-- Data for Name: lich_su_lich_hen; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lich_su_lich_hen (id, lich_hen_id, ngay_cu, gio_cu, ngay_moi, gio_moi, trang_thai_cu, trang_thai_moi, loai_thay_doi, ly_do, nguoi_thay_doi, thoi_gian_thay_doi) FROM stdin;
1	1	\N	\N	2026-02-15	10:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001012	2026-02-08 03:30:00+00
2	2	\N	\N	2026-01-07	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001008	2025-12-31 02:30:00+00
3	3	\N	\N	2026-03-02	14:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001038	2026-02-23 07:30:00+00
4	4	\N	\N	2026-02-27	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001003	2026-02-20 08:00:00+00
5	5	\N	\N	2026-02-08	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001031	2026-02-01 07:00:00+00
6	6	\N	\N	2026-02-24	08:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001029	2026-02-17 01:30:00+00
7	7	\N	\N	2026-01-11	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001009	2026-01-04 05:00:00+00
8	8	\N	\N	2026-03-21	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001039	2026-03-14 09:30:00+00
9	9	\N	\N	2026-02-07	14:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001045	2026-01-31 07:30:00+00
10	10	\N	\N	2026-04-20	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001029	2026-04-13 08:00:00+00
11	11	\N	\N	2026-02-22	12:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001027	2026-02-15 05:30:00+00
12	12	\N	\N	2026-02-10	13:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001017	2026-02-03 06:30:00+00
13	13	\N	\N	2026-01-20	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-01-13 07:00:00+00
14	14	\N	\N	2026-02-25	08:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001009	2026-02-18 01:30:00+00
15	15	\N	\N	2026-01-08	16:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001008	2026-01-01 09:30:00+00
16	16	\N	\N	2026-02-15	13:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001039	2026-02-08 06:00:00+00
17	17	\N	\N	2026-02-15	08:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-02-08 01:00:00+00
18	18	\N	\N	2026-01-29	08:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001036	2026-01-22 01:30:00+00
19	19	\N	\N	2026-01-15	11:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001028	2026-01-08 04:00:00+00
20	20	\N	\N	2026-04-09	16:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-04-02 09:00:00+00
21	21	\N	\N	2026-01-04	09:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001049	2025-12-28 02:30:00+00
22	22	\N	\N	2026-02-13	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001010	2026-02-06 05:00:00+00
23	23	\N	\N	2026-03-26	13:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001048	2026-03-19 06:00:00+00
24	24	\N	\N	2026-01-12	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001027	2026-01-05 08:00:00+00
25	25	\N	\N	2026-02-13	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001047	2026-02-06 02:30:00+00
26	26	\N	\N	2026-04-10	16:00:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001004	2026-04-03 09:00:00+00
27	27	\N	\N	2026-01-21	16:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-01-14 09:00:00+00
28	28	\N	\N	2026-02-26	13:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001029	2026-02-19 06:30:00+00
29	29	\N	\N	2026-02-04	10:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001028	2026-01-28 03:00:00+00
30	30	\N	\N	2026-02-06	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-01-30 09:30:00+00
31	31	\N	\N	2026-01-06	10:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001004	2025-12-30 03:30:00+00
32	32	\N	\N	2026-01-27	11:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001009	2026-01-20 04:00:00+00
33	33	\N	\N	2026-02-07	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001032	2026-01-31 05:00:00+00
34	34	\N	\N	2026-01-23	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001046	2026-01-16 02:30:00+00
35	35	\N	\N	2026-03-06	15:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001026	2026-02-27 08:30:00+00
36	36	\N	\N	2026-02-25	07:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001005	2026-02-18 00:30:00+00
37	37	\N	\N	2026-03-15	13:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001041	2026-03-08 06:30:00+00
38	38	\N	\N	2026-02-07	08:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001021	2026-01-31 01:30:00+00
39	39	\N	\N	2026-04-13	16:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001045	2026-04-06 09:30:00+00
40	40	\N	\N	2026-01-12	13:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001028	2026-01-05 06:00:00+00
41	41	\N	\N	2026-02-21	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001020	2026-02-14 08:00:00+00
42	42	\N	\N	2026-01-29	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001033	2026-01-22 05:00:00+00
43	43	\N	\N	2026-03-09	15:00:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001050	2026-03-02 08:00:00+00
44	44	\N	\N	2026-02-14	09:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001010	2026-02-07 02:00:00+00
45	45	\N	\N	2026-01-26	09:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001049	2026-01-19 02:00:00+00
46	46	\N	\N	2026-01-23	14:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001037	2026-01-16 07:30:00+00
47	47	\N	\N	2026-02-27	16:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001041	2026-02-20 09:30:00+00
48	48	\N	\N	2026-01-20	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001029	2026-01-13 07:00:00+00
49	49	\N	\N	2026-04-12	11:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001033	2026-04-05 04:00:00+00
50	50	\N	\N	2026-02-09	14:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001004	2026-02-02 07:30:00+00
51	51	\N	\N	2026-04-17	11:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-04-10 04:00:00+00
52	52	\N	\N	2026-03-18	15:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001038	2026-03-11 08:30:00+00
53	53	\N	\N	2026-04-12	07:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001037	2026-04-05 00:30:00+00
54	54	\N	\N	2026-02-11	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001010	2026-02-04 09:30:00+00
55	55	\N	\N	2026-02-27	08:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-02-20 01:30:00+00
56	56	\N	\N	2026-03-24	09:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001046	2026-03-17 02:00:00+00
57	57	\N	\N	2026-02-26	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001024	2026-02-19 08:00:00+00
58	58	\N	\N	2026-02-19	13:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001039	2026-02-12 06:30:00+00
59	59	\N	\N	2026-04-12	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001007	2026-04-05 05:00:00+00
60	60	\N	\N	2026-03-28	13:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001047	2026-03-21 06:30:00+00
61	61	\N	\N	2026-04-22	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001038	2026-04-15 02:30:00+00
62	62	\N	\N	2026-02-14	11:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001039	2026-02-07 04:30:00+00
63	63	\N	\N	2026-02-09	15:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001022	2026-02-02 08:30:00+00
64	64	\N	\N	2026-03-27	15:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-03-20 08:00:00+00
65	65	\N	\N	2026-03-07	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001020	2026-02-28 05:00:00+00
66	66	\N	\N	2026-01-28	12:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001015	2026-01-21 05:30:00+00
67	67	\N	\N	2026-01-20	08:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001007	2026-01-13 01:30:00+00
68	68	\N	\N	2026-04-09	15:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001022	2026-04-02 08:00:00+00
69	69	\N	\N	2026-01-17	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001011	2026-01-10 09:30:00+00
70	70	\N	\N	2026-04-17	16:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001029	2026-04-10 09:00:00+00
71	71	\N	\N	2026-02-22	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001040	2026-02-15 05:00:00+00
72	72	\N	\N	2026-04-07	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001016	2026-03-31 07:00:00+00
73	73	\N	\N	2026-04-14	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001044	2026-04-07 07:00:00+00
74	74	\N	\N	2026-02-26	14:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001025	2026-02-19 07:30:00+00
75	75	\N	\N	2026-03-09	13:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001013	2026-03-02 06:00:00+00
76	76	\N	\N	2026-01-18	11:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001031	2026-01-11 04:00:00+00
77	77	\N	\N	2026-03-12	08:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-03-05 01:00:00+00
78	78	\N	\N	2026-02-04	14:00:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001028	2026-01-28 07:00:00+00
79	79	\N	\N	2026-01-29	14:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001002	2026-01-22 07:30:00+00
80	80	\N	\N	2026-01-07	13:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001025	2025-12-31 06:30:00+00
81	81	\N	\N	2026-02-17	10:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001007	2026-02-10 03:00:00+00
82	82	\N	\N	2026-04-12	09:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001019	2026-04-05 02:00:00+00
83	83	\N	\N	2026-03-31	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001040	2026-03-24 02:30:00+00
84	84	\N	\N	2026-01-11	07:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001010	2026-01-04 00:30:00+00
85	85	\N	\N	2026-04-04	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001050	2026-03-28 09:30:00+00
86	86	\N	\N	2026-01-31	11:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001016	2026-01-24 04:00:00+00
87	87	\N	\N	2026-03-23	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001008	2026-03-16 09:30:00+00
88	88	\N	\N	2026-03-18	15:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001033	2026-03-11 08:00:00+00
89	89	\N	\N	2026-01-31	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001001	2026-01-24 02:30:00+00
90	90	\N	\N	2026-02-15	10:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-02-08 03:30:00+00
91	91	\N	\N	2026-03-09	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001035	2026-03-02 05:00:00+00
92	92	\N	\N	2026-04-11	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001031	2026-04-04 08:00:00+00
93	93	\N	\N	2026-03-23	13:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001048	2026-03-16 06:30:00+00
94	94	\N	\N	2026-02-15	08:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001047	2026-02-08 01:30:00+00
95	95	\N	\N	2026-04-09	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001003	2026-04-02 09:30:00+00
96	96	\N	\N	2026-03-11	12:00:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001050	2026-03-04 05:00:00+00
97	97	\N	\N	2026-03-31	14:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001009	2026-03-24 07:00:00+00
98	98	\N	\N	2026-04-02	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001013	2026-03-26 07:00:00+00
99	99	\N	\N	2026-04-12	10:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001020	2026-04-05 03:00:00+00
100	100	\N	\N	2026-02-20	15:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001003	2026-02-13 08:30:00+00
101	101	\N	\N	2026-02-06	12:00:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001042	2026-01-30 05:00:00+00
102	102	\N	\N	2026-02-04	08:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001026	2026-01-28 01:30:00+00
103	103	\N	\N	2026-02-19	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001045	2026-02-12 05:00:00+00
104	104	\N	\N	2026-02-17	15:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001006	2026-02-10 08:30:00+00
105	105	\N	\N	2026-01-11	13:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001019	2026-01-04 06:00:00+00
106	106	\N	\N	2026-01-14	08:30:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001019	2026-01-07 01:30:00+00
107	107	\N	\N	2026-02-27	16:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001045	2026-02-20 09:30:00+00
108	108	\N	\N	2026-02-14	14:00:00	\N	Da xac nhan	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001023	2026-02-07 07:00:00+00
109	109	\N	\N	2026-02-25	11:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001043	2026-02-18 04:00:00+00
110	110	\N	\N	2026-02-16	15:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001010	2026-02-09 08:00:00+00
111	111	\N	\N	2026-03-28	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001005	2026-03-21 07:00:00+00
112	112	\N	\N	2026-04-10	12:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001037	2026-04-03 05:30:00+00
113	113	\N	\N	2026-03-19	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001024	2026-03-12 02:30:00+00
114	114	\N	\N	2026-04-08	08:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001024	2026-04-01 01:00:00+00
115	115	\N	\N	2026-02-10	11:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001002	2026-02-03 04:00:00+00
116	116	\N	\N	2026-03-05	15:30:00	\N	Huy	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001036	2026-02-26 08:30:00+00
117	117	\N	\N	2026-02-03	11:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001040	2026-01-27 04:30:00+00
118	118	\N	\N	2026-03-30	14:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001009	2026-03-23 07:00:00+00
119	119	\N	\N	2026-02-27	09:30:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001044	2026-02-20 02:30:00+00
120	120	\N	\N	2026-03-27	12:00:00	\N	Hoan thanh	Tao lich	Tao lich kham	00000000-0000-0000-0000-000000001035	2026-03-20 05:00:00+00
\.


--
-- Data for Name: nhat_ky_hoat_dong; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nhat_ky_hoat_dong (id, tai_khoan_id, hanh_dong, loai_doi_tuong, doi_tuong_id, du_lieu_cu, du_lieu_moi, thoi_gian) FROM stdin;
1	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000001	\N	{"vaiTro": "Admin", "trangThai": "Active", "tenDangNhap": "admin"}	2026-01-01 01:01:00+00
2	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000101	\N	{"vaiTro": "BacSi", "trangThai": "Active", "tenDangNhap": "bs1"}	2026-01-01 01:02:00+00
3	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000102	\N	{"vaiTro": "BacSi", "trangThai": "Active", "tenDangNhap": "bs2"}	2026-01-01 01:03:00+00
4	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000103	\N	{"vaiTro": "BacSi", "trangThai": "Active", "tenDangNhap": "bs3"}	2026-01-01 01:04:00+00
5	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000104	\N	{"vaiTro": "BacSi", "trangThai": "Active", "tenDangNhap": "bs4"}	2026-01-01 01:05:00+00
6	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000000105	\N	{"vaiTro": "BacSi", "trangThai": "Active", "tenDangNhap": "bs5"}	2026-01-01 01:06:00+00
9	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001001	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn1"}	2026-01-01 01:09:00+00
10	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001002	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn2"}	2026-01-01 01:10:00+00
11	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001003	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn3"}	2026-01-01 01:11:00+00
12	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001004	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn4"}	2026-01-01 01:12:00+00
13	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001005	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn5"}	2026-01-01 01:13:00+00
14	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001006	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn6"}	2026-01-01 01:14:00+00
15	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001007	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn7"}	2026-01-01 01:15:00+00
16	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001008	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn8"}	2026-01-01 01:16:00+00
17	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001009	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn9"}	2026-01-01 01:17:00+00
18	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001010	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn10"}	2026-01-01 01:18:00+00
19	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001011	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn11"}	2026-01-01 01:19:00+00
20	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001012	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn12"}	2026-01-01 01:20:00+00
21	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001013	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn13"}	2026-01-01 01:21:00+00
22	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001014	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn14"}	2026-01-01 01:22:00+00
23	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001015	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn15"}	2026-01-01 01:23:00+00
24	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001016	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn16"}	2026-01-01 01:24:00+00
25	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001017	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn17"}	2026-01-01 01:25:00+00
26	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001018	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn18"}	2026-01-01 01:26:00+00
27	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001019	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn19"}	2026-01-01 01:27:00+00
28	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001020	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn20"}	2026-01-01 01:28:00+00
29	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001021	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn21"}	2026-01-01 01:29:00+00
30	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001022	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn22"}	2026-01-01 01:30:00+00
31	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001023	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn23"}	2026-01-01 01:31:00+00
32	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001024	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn24"}	2026-01-01 01:32:00+00
33	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001025	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn25"}	2026-01-01 01:33:00+00
34	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001026	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn26"}	2026-01-01 01:34:00+00
35	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001027	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn27"}	2026-01-01 01:35:00+00
36	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001028	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn28"}	2026-01-01 01:36:00+00
37	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001029	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn29"}	2026-01-01 01:37:00+00
38	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001030	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn30"}	2026-01-01 01:38:00+00
39	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001031	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn31"}	2026-01-01 01:39:00+00
40	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001032	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn32"}	2026-01-01 01:40:00+00
41	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001033	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn33"}	2026-01-01 01:41:00+00
42	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001034	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn34"}	2026-01-01 01:42:00+00
43	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001035	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn35"}	2026-01-01 01:43:00+00
44	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001036	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn36"}	2026-01-01 01:44:00+00
45	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001037	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn37"}	2026-01-01 01:45:00+00
46	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001038	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn38"}	2026-01-01 01:46:00+00
47	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001039	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn39"}	2026-01-01 01:47:00+00
48	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001040	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn40"}	2026-01-01 01:48:00+00
49	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001041	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn41"}	2026-01-01 01:49:00+00
50	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001042	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn42"}	2026-01-01 01:50:00+00
51	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001043	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn43"}	2026-01-01 01:51:00+00
52	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001044	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn44"}	2026-01-01 01:52:00+00
53	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001045	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn45"}	2026-01-01 01:53:00+00
54	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001046	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn46"}	2026-01-01 01:54:00+00
55	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001047	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn47"}	2026-01-01 01:55:00+00
56	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001048	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn48"}	2026-01-01 01:56:00+00
57	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001049	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn49"}	2026-01-01 01:57:00+00
58	00000000-0000-0000-0000-000000000001	TAO_TAI_KHOAN	TaiKhoan	00000000-0000-0000-0000-000000001050	\N	{"vaiTro": "NguoiDung", "trangThai": "Active", "tenDangNhap": "bn50"}	2026-01-01 01:58:00+00
\.


--
-- Data for Name: phieu_kham; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.phieu_kham (id, lich_hen_id, benh_nhan_id, bac_si_id, ngay_kham, trieu_chung, ket_qua_kham, ket_luan, huong_dieu_tri, ghi_chu_bac_si, ngay_tai_kham, chi_phi_kham, ngay_tao, ngay_cap_nhat) FROM stdin;
1	1	12	3	2026-02-15	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-15 03:30:00+00	2026-02-15 04:00:00+00
2	2	8	1	2026-01-07	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-07 02:30:00+00	2026-01-07 03:00:00+00
3	3	38	1	2026-03-02	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Viem phoi.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-02 07:30:00+00	2026-03-02 08:00:00+00
4	4	3	5	2026-02-27	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Dau da day.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-27 08:00:00+00	2026-02-27 08:30:00+00
5	5	31	4	2026-02-08	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-08 07:00:00+00	2026-02-08 07:30:00+00
6	7	9	3	2026-01-11	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-11 05:00:00+00	2026-01-11 05:30:00+00
7	8	39	5	2026-03-21	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem phoi.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-21 09:30:00+00	2026-03-21 10:00:00+00
8	9	45	1	2026-02-07	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-07 07:30:00+00	2026-02-07 08:00:00+00
9	10	29	2	2026-04-20	Noi man ngua	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-20 08:00:00+00	2026-04-20 08:30:00+00
10	11	27	1	2026-02-22	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-03-01	100000.00	2026-02-22 05:30:00+00	2026-02-22 06:00:00+00
11	13	6	1	2026-01-20	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-20 07:00:00+00	2026-01-20 07:30:00+00
12	16	39	3	2026-02-15	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-15 06:00:00+00	2026-02-15 06:30:00+00
13	17	43	4	2026-02-15	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-15 01:00:00+00	2026-02-15 01:30:00+00
14	20	43	3	2026-04-09	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Viem phoi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-09 09:00:00+00	2026-04-09 09:30:00+00
15	22	10	5	2026-02-13	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Di ung.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-13 05:00:00+00	2026-02-13 05:30:00+00
16	23	48	1	2026-03-26	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-26 06:00:00+00	2026-03-26 06:30:00+00
17	24	27	4	2026-01-12	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-12 08:00:00+00	2026-01-12 08:30:00+00
18	25	47	3	2026-02-13	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Viem phoi.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-02-20	100000.00	2026-02-13 02:30:00+00	2026-02-13 03:00:00+00
19	28	29	4	2026-02-26	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Di ung.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-26 06:30:00+00	2026-02-26 07:00:00+00
20	29	28	1	2026-02-04	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Viem phoi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-04 03:00:00+00	2026-02-04 03:30:00+00
21	30	43	3	2026-02-06	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-06 09:30:00+00	2026-02-06 10:00:00+00
22	31	4	1	2026-01-06	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Cam cum.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-06 03:30:00+00	2026-01-06 04:00:00+00
23	33	32	4	2026-02-07	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Cam cum.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-07 05:00:00+00	2026-02-07 05:30:00+00
24	34	46	2	2026-01-23	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Dau da day.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-23 02:30:00+00	2026-01-23 03:00:00+00
25	35	26	1	2026-03-06	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Cam cum.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-06 08:30:00+00	2026-03-06 09:00:00+00
26	38	21	2	2026-02-07	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Di ung.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-07 01:30:00+00	2026-02-07 02:00:00+00
27	40	28	5	2026-01-12	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-01-19	100000.00	2026-01-12 06:00:00+00	2026-01-12 06:30:00+00
28	41	20	3	2026-02-21	Noi man ngua	Ket qua tham kham phu hop voi chan doan Viem phoi.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-21 08:00:00+00	2026-02-21 08:30:00+00
29	42	33	1	2026-01-29	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-29 05:00:00+00	2026-01-29 05:30:00+00
30	44	10	3	2026-02-14	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-14 02:00:00+00	2026-02-14 02:30:00+00
31	48	29	3	2026-01-20	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-01-20 07:00:00+00	2026-01-20 07:30:00+00
32	49	33	1	2026-04-12	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-12 04:00:00+00	2026-04-12 04:30:00+00
33	50	4	3	2026-02-09	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Viem hong.	Uong nhieu nuoc	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-09 07:30:00+00	2026-02-09 08:00:00+00
34	52	38	5	2026-03-18	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-18 08:30:00+00	2026-03-18 09:00:00+00
35	54	10	1	2026-02-11	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Viem hong.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-11 09:30:00+00	2026-02-11 10:00:00+00
36	56	46	4	2026-03-24	Noi man ngua	Ket qua tham kham phu hop voi chan doan Viem phoi.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-03-31	100000.00	2026-03-24 02:00:00+00	2026-03-24 02:30:00+00
37	57	24	3	2026-02-26	Noi man ngua	Ket qua tham kham phu hop voi chan doan Dau da day.	Nghi ngoi va theo doi	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-26 08:00:00+00	2026-02-26 08:30:00+00
38	59	7	5	2026-04-12	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Cam cum.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-04-19	100000.00	2026-04-12 05:00:00+00	2026-04-12 05:30:00+00
39	60	47	5	2026-03-28	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-28 06:30:00+00	2026-03-28 07:00:00+00
40	61	38	2	2026-04-22	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-22 02:30:00+00	2026-04-22 03:00:00+00
41	62	39	1	2026-02-14	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Dau da day.	Nghi ngoi va theo doi	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-14 04:30:00+00	2026-02-14 05:00:00+00
42	65	20	2	2026-03-07	Noi man ngua	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-07 05:00:00+00	2026-03-07 05:30:00+00
43	66	15	2	2026-01-28	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-28 05:30:00+00	2026-01-28 06:00:00+00
44	69	11	2	2026-01-17	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-17 09:30:00+00	2026-01-17 10:00:00+00
45	71	40	3	2026-02-22	Noi man ngua	Ket qua tham kham phu hop voi chan doan Dau da day.	Nghi ngoi va theo doi	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-22 05:00:00+00	2026-02-22 05:30:00+00
46	72	16	3	2026-04-07	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Cam cum.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-07 07:00:00+00	2026-04-07 07:30:00+00
47	73	44	5	2026-04-14	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-14 07:00:00+00	2026-04-14 07:30:00+00
48	77	6	2	2026-03-12	Noi man ngua	Ket qua tham kham phu hop voi chan doan Di ung.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-12 01:00:00+00	2026-03-12 01:30:00+00
49	80	25	1	2026-01-07	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Viem phoi.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-07 06:30:00+00	2026-01-07 07:00:00+00
50	81	7	3	2026-02-17	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Di ung.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-17 03:00:00+00	2026-02-17 03:30:00+00
51	82	19	4	2026-04-12	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-04-19	100000.00	2026-04-12 02:00:00+00	2026-04-12 02:30:00+00
52	83	40	1	2026-03-31	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-31 02:30:00+00	2026-03-31 03:00:00+00
53	84	10	5	2026-01-11	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-11 00:30:00+00	2026-01-11 01:00:00+00
54	85	50	3	2026-04-04	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Viem phoi.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-04 09:30:00+00	2026-04-04 10:00:00+00
55	86	16	4	2026-01-31	Noi man ngua	Ket qua tham kham phu hop voi chan doan Di ung.	Diet, tap luyen dieu do	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-01-31 04:00:00+00	2026-01-31 04:30:00+00
56	87	8	4	2026-03-23	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-23 09:30:00+00	2026-03-23 10:00:00+00
57	89	1	5	2026-01-31	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Viem hong.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-02-07	100000.00	2026-01-31 02:30:00+00	2026-01-31 03:00:00+00
58	90	43	1	2026-02-15	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Nghi ngoi va theo doi	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-15 03:30:00+00	2026-02-15 04:00:00+00
59	91	35	5	2026-03-09	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Cam cum.	Uong thuoc dung lieu	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-03-09 05:00:00+00	2026-03-09 05:30:00+00
60	92	31	1	2026-04-11	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-11 08:00:00+00	2026-04-11 08:30:00+00
61	93	48	1	2026-03-23	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-23 06:30:00+00	2026-03-23 07:00:00+00
62	94	47	1	2026-02-15	Noi man ngua	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-15 01:30:00+00	2026-02-15 02:00:00+00
63	95	3	3	2026-04-09	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-09 09:30:00+00	2026-04-09 10:00:00+00
64	98	13	1	2026-04-02	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-02 07:00:00+00	2026-04-02 07:30:00+00
65	99	20	5	2026-04-12	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Viem hong.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-12 03:00:00+00	2026-04-12 03:30:00+00
66	100	3	2	2026-02-20	Noi man ngua	Ket qua tham kham phu hop voi chan doan Di ung.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-20 08:30:00+00	2026-02-20 09:00:00+00
67	102	26	4	2026-02-04	Dau dau, sot nhe	Ket qua tham kham phu hop voi chan doan Viem hong.	Tai kham sau 7 ngay	Dieu tri theo don thuoc va theo doi	\N	2026-02-11	100000.00	2026-02-04 01:30:00+00	2026-02-04 02:00:00+00
68	103	45	4	2026-02-19	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-19 05:00:00+00	2026-02-19 05:30:00+00
69	105	19	3	2026-01-11	Dau nguc, hoi hop	Ket qua tham kham phu hop voi chan doan Cam cum.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-01-11 06:00:00+00	2026-01-11 06:30:00+00
70	107	45	4	2026-02-27	Noi man ngua	Ket qua tham kham phu hop voi chan doan Di ung.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-27 09:30:00+00	2026-02-27 10:00:00+00
71	109	43	4	2026-02-25	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Cam cum.	Diet, tap luyen dieu do	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-25 04:00:00+00	2026-02-25 04:30:00+00
72	110	10	5	2026-02-16	Noi man ngua	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-16 08:00:00+00	2026-02-16 08:30:00+00
73	111	5	2	2026-03-28	Dau khop, met moi	Ket qua tham kham phu hop voi chan doan Roi loan tieu hoa.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-28 07:00:00+00	2026-03-28 07:30:00+00
74	112	37	1	2026-04-10	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Cam cum.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-10 05:30:00+00	2026-04-10 06:00:00+00
75	113	24	4	2026-03-19	Ho, sot, met moi	Ket qua tham kham phu hop voi chan doan Dau da day.	Uong thuoc dung lieu	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-19 02:30:00+00	2026-03-19 03:00:00+00
76	114	24	4	2026-04-08	Noi man ngua	Ket qua tham kham phu hop voi chan doan Viem hong.	Uong nhieu nuoc	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-04-08 01:00:00+00	2026-04-08 01:30:00+00
77	115	2	2	2026-02-10	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-10 04:00:00+00	2026-02-10 04:30:00+00
78	117	40	3	2026-02-03	Kho tho, ho khan	Ket qua tham kham phu hop voi chan doan Tang huyet ap nhe.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-02-03 04:30:00+00	2026-02-03 05:00:00+00
79	118	9	1	2026-03-30	Noi man ngua	Ket qua tham kham phu hop voi chan doan Cam cum.	Theo doi tai nha	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-30 07:00:00+00	2026-03-30 07:30:00+00
80	119	44	3	2026-02-27	Dau bung, buon non	Ket qua tham kham phu hop voi chan doan Dau da day.	Diet, tap luyen dieu do	Theo doi theo huong dan cua bac si	\N	\N	100000.00	2026-02-27 02:30:00+00	2026-02-27 03:00:00+00
81	120	35	3	2026-03-27	Dau hong, nghen mui	Ket qua tham kham phu hop voi chan doan Hoi chung met moi.	Diet, tap luyen dieu do	Dieu tri theo don thuoc va theo doi	\N	\N	100000.00	2026-03-27 05:00:00+00	2026-03-27 05:30:00+00
\.


--
-- Data for Name: quan_ly; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quan_ly (id, tai_khoan_id, ho_ten, so_dien_thoai, email) FROM stdin;
1	00000000-0000-0000-0000-000000000001	Quan tri vien he thong	0900000000	admin@qlphongkham.local
\.


--
-- Data for Name: tai_khoan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tai_khoan (id, ten_dang_nhap, mat_khau_ma_hoa, vai_tro, trang_thai, ngay_tao, ngay_cap_nhat, quan_ly_id, bac_si_id, benh_nhan_id) FROM stdin;
00000000-0000-0000-0000-000000000001	admin	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	Admin	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	1	\N	\N
00000000-0000-0000-0000-000000000101	bs1	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	BacSi	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	1	\N
00000000-0000-0000-0000-000000000102	bs2	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	BacSi	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	2	\N
00000000-0000-0000-0000-000000000103	bs3	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	BacSi	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	3	\N
00000000-0000-0000-0000-000000000104	bs4	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	BacSi	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	4	\N
00000000-0000-0000-0000-000000000105	bs5	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	BacSi	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	5	\N
00000000-0000-0000-0000-000000001001	bn1	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	1
00000000-0000-0000-0000-000000001002	bn2	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	2
00000000-0000-0000-0000-000000001003	bn3	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	3
00000000-0000-0000-0000-000000001004	bn4	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	4
00000000-0000-0000-0000-000000001005	bn5	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	5
00000000-0000-0000-0000-000000001006	bn6	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	6
00000000-0000-0000-0000-000000001007	bn7	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	7
00000000-0000-0000-0000-000000001008	bn8	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	8
00000000-0000-0000-0000-000000001009	bn9	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	9
00000000-0000-0000-0000-000000001010	bn10	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	10
00000000-0000-0000-0000-000000001011	bn11	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	11
00000000-0000-0000-0000-000000001012	bn12	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	12
00000000-0000-0000-0000-000000001013	bn13	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	13
00000000-0000-0000-0000-000000001014	bn14	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	14
00000000-0000-0000-0000-000000001015	bn15	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	15
00000000-0000-0000-0000-000000001016	bn16	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	16
00000000-0000-0000-0000-000000001017	bn17	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	17
00000000-0000-0000-0000-000000001018	bn18	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	18
00000000-0000-0000-0000-000000001019	bn19	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	19
00000000-0000-0000-0000-000000001020	bn20	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	20
00000000-0000-0000-0000-000000001021	bn21	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	21
00000000-0000-0000-0000-000000001022	bn22	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	22
00000000-0000-0000-0000-000000001023	bn23	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	23
00000000-0000-0000-0000-000000001024	bn24	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	24
00000000-0000-0000-0000-000000001025	bn25	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	25
00000000-0000-0000-0000-000000001026	bn26	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	26
00000000-0000-0000-0000-000000001027	bn27	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	27
00000000-0000-0000-0000-000000001028	bn28	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	28
00000000-0000-0000-0000-000000001029	bn29	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	29
00000000-0000-0000-0000-000000001030	bn30	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	30
00000000-0000-0000-0000-000000001031	bn31	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	31
00000000-0000-0000-0000-000000001032	bn32	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	32
00000000-0000-0000-0000-000000001033	bn33	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	33
00000000-0000-0000-0000-000000001034	bn34	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	34
00000000-0000-0000-0000-000000001035	bn35	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	35
00000000-0000-0000-0000-000000001036	bn36	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	36
00000000-0000-0000-0000-000000001037	bn37	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	37
00000000-0000-0000-0000-000000001038	bn38	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	38
00000000-0000-0000-0000-000000001039	bn39	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	39
00000000-0000-0000-0000-000000001040	bn40	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	40
00000000-0000-0000-0000-000000001041	bn41	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	41
00000000-0000-0000-0000-000000001042	bn42	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	42
00000000-0000-0000-0000-000000001043	bn43	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	43
00000000-0000-0000-0000-000000001044	bn44	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	44
00000000-0000-0000-0000-000000001045	bn45	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	45
00000000-0000-0000-0000-000000001046	bn46	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	46
00000000-0000-0000-0000-000000001047	bn47	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	47
00000000-0000-0000-0000-000000001048	bn48	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	48
00000000-0000-0000-0000-000000001049	bn49	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	49
00000000-0000-0000-0000-000000001050	bn50	$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e	NguoiDung	Active	2026-01-01 01:00:00+00	2026-10-07 14:50:30.54353+00	\N	\N	50
\.


--
-- Data for Name: thanh_toan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.thanh_toan (id, hoa_don_id, so_tien, phuong_thuc_thanh_toan, ma_giao_dich, trang_thai, thoi_gian_thanh_toan) FROM stdin;
1	HD004	475000.00	Tien mat	GD000001	Thanh cong	2026-02-27 10:05:00+00
2	HD005	322000.00	Chuyen khoan	GD000002	Thanh cong	2026-02-08 10:05:00+00
3	HD007	805000.00	Tien mat	GD000003	Thanh cong	2026-03-21 10:05:00+00
4	HD008	156000.00	Chuyen khoan	GD000004	Thanh cong	2026-02-07 10:05:00+00
5	HD009	225000.00	Chuyen khoan	GD000005	Thanh cong	2026-04-20 10:05:00+00
6	HD010	326000.00	Tien mat	GD000006	Thanh cong	2026-02-22 10:05:00+00
7	HD014	598000.00	Chuyen khoan	GD000007	Thanh cong	2026-04-09 10:05:00+00
8	HD016	415000.00	Tien mat	GD000008	Thanh cong	2026-03-26 10:05:00+00
9	HD020	417000.00	Tien mat	GD000009	Thanh cong	2026-02-04 10:05:00+00
10	HD022	310000.00	Tien mat	GD000010	Thanh cong	2026-01-06 10:05:00+00
11	HD023	280000.00	Tien mat	GD000011	Thanh cong	2026-02-07 10:05:00+00
12	HD024	570000.00	Chuyen khoan	GD000012	Thanh cong	2026-01-23 10:05:00+00
13	HD026	495000.00	Chuyen khoan	GD000013	Thanh cong	2026-02-07 10:05:00+00
14	HD034	240000.00	Tien mat	GD000014	Thanh cong	2026-03-18 10:05:00+00
15	HD036	500000.00	Tien mat	GD000015	Thanh cong	2026-03-24 10:05:00+00
16	HD039	552000.00	Tien mat	GD000016	Thanh cong	2026-03-28 10:05:00+00
17	HD043	112000.00	Tien mat	GD000017	Thanh cong	2026-01-28 10:05:00+00
18	HD044	435000.00	Chuyen khoan	GD000018	Thanh cong	2026-01-17 10:05:00+00
19	HD046	310000.00	Tien mat	GD000019	Thanh cong	2026-04-07 10:05:00+00
20	HD047	609000.00	Tien mat	GD000020	Thanh cong	2026-04-14 10:05:00+00
21	HD051	196000.00	Chuyen khoan	GD000021	Thanh cong	2026-04-12 10:05:00+00
22	HD058	695000.00	Tien mat	GD000022	Thanh cong	2026-02-15 10:05:00+00
23	HD060	210000.00	Chuyen khoan	GD000023	Thanh cong	2026-04-11 10:05:00+00
24	HD062	140000.00	Chuyen khoan	GD000024	Thanh cong	2026-02-15 10:05:00+00
25	HD064	190000.00	Tien mat	GD000025	Thanh cong	2026-04-02 10:05:00+00
26	HD066	280000.00	Tien mat	GD000026	Thanh cong	2026-02-20 10:05:00+00
27	HD072	280000.00	Chuyen khoan	GD000027	Thanh cong	2026-02-16 10:05:00+00
28	HD073	301000.00	Tien mat	GD000028	Thanh cong	2026-03-28 10:05:00+00
29	HD074	508000.00	Chuyen khoan	GD000029	Thanh cong	2026-04-10 10:05:00+00
30	HD076	450000.00	Tien mat	GD000030	Thanh cong	2026-04-08 10:05:00+00
31	HD078	460000.00	Chuyen khoan	GD000031	Thanh cong	2026-02-03 10:05:00+00
32	HD081	218000.00	Tien mat	GD000032	Thanh cong	2026-03-27 10:05:00+00
\.


--
-- Data for Name: thong_bao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.thong_bao (id, tai_khoan_id, lich_hen_id, loai, kenh, tieu_de, noi_dung, trang_thai, thoi_gian_du_kien_gui, thoi_gian_gui, thoi_gian_doc, ngay_tao) FROM stdin;
1	00000000-0000-0000-0000-000000001012	1	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-15 luc 10:30.	Da gui	2026-02-14 01:00:00+00	2026-02-14 01:00:00+00	2026-02-14 03:35:00+00	2026-02-08 03:30:00+00
2	00000000-0000-0000-0000-000000001008	2	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-07 luc 09:30.	Da gui	2026-01-06 01:00:00+00	2026-01-06 01:00:00+00	2026-01-06 02:35:00+00	2025-12-31 02:30:00+00
3	00000000-0000-0000-0000-000000001038	3	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-02 luc 14:30.	Da gui	2026-03-01 01:00:00+00	2026-03-01 01:00:00+00	2026-03-01 07:35:00+00	2026-02-23 07:30:00+00
4	00000000-0000-0000-0000-000000001003	4	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-27 luc 15:00.	Da gui	2026-02-26 01:00:00+00	2026-02-26 01:00:00+00	2026-02-26 08:05:00+00	2026-02-20 08:00:00+00
5	00000000-0000-0000-0000-000000001031	5	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-08 luc 14:00.	Da gui	2026-02-07 01:00:00+00	2026-02-07 01:00:00+00	2026-02-07 07:05:00+00	2026-02-01 07:00:00+00
6	00000000-0000-0000-0000-000000001029	6	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-24 luc 08:30.	Da gui	2026-02-23 01:00:00+00	2026-02-23 01:00:00+00	\N	2026-02-17 01:30:00+00
7	00000000-0000-0000-0000-000000001009	7	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-11 luc 12:00.	Da gui	2026-01-10 01:00:00+00	2026-01-10 01:00:00+00	2026-01-10 05:05:00+00	2026-01-04 05:00:00+00
8	00000000-0000-0000-0000-000000001039	8	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-21 luc 16:30.	Da gui	2026-03-20 01:00:00+00	2026-03-20 01:00:00+00	2026-03-20 09:35:00+00	2026-03-14 09:30:00+00
9	00000000-0000-0000-0000-000000001045	9	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-07 luc 14:30.	Da gui	2026-02-06 01:00:00+00	2026-02-06 01:00:00+00	2026-02-06 07:35:00+00	2026-01-31 07:30:00+00
10	00000000-0000-0000-0000-000000001029	10	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-04-20 luc 15:00.	Da gui	2026-04-19 01:00:00+00	2026-04-19 01:00:00+00	2026-04-19 08:05:00+00	2026-04-13 08:00:00+00
11	00000000-0000-0000-0000-000000001027	11	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-22 luc 12:30.	Da gui	2026-02-21 01:00:00+00	2026-02-21 01:00:00+00	2026-02-21 05:35:00+00	2026-02-15 05:30:00+00
12	00000000-0000-0000-0000-000000001017	12	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-10 luc 13:30.	Da gui	2026-02-09 01:00:00+00	2026-02-09 01:00:00+00	\N	2026-02-03 06:30:00+00
13	00000000-0000-0000-0000-000000001006	13	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-20 luc 14:00.	Da gui	2026-01-19 01:00:00+00	2026-01-19 01:00:00+00	2026-01-19 07:05:00+00	2026-01-13 07:00:00+00
14	00000000-0000-0000-0000-000000001009	14	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-25 luc 08:30.	Da gui	2026-02-24 01:00:00+00	2026-02-24 01:00:00+00	\N	2026-02-18 01:30:00+00
15	00000000-0000-0000-0000-000000001008	15	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-01-08 luc 16:30.	Da gui	2026-01-07 01:00:00+00	2026-01-07 01:00:00+00	\N	2026-01-01 09:30:00+00
16	00000000-0000-0000-0000-000000001039	16	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-15 luc 13:00.	Da gui	2026-02-14 01:00:00+00	2026-02-14 01:00:00+00	2026-02-14 06:05:00+00	2026-02-08 06:00:00+00
17	00000000-0000-0000-0000-000000001043	17	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-15 luc 08:00.	Da gui	2026-02-14 01:00:00+00	2026-02-14 01:00:00+00	2026-02-14 01:05:00+00	2026-02-08 01:00:00+00
18	00000000-0000-0000-0000-000000001036	18	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-29 luc 08:30.	Da gui	2026-01-28 01:00:00+00	2026-01-28 01:00:00+00	\N	2026-01-22 01:30:00+00
19	00000000-0000-0000-0000-000000001028	19	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-15 luc 11:00.	Da gui	2026-01-14 01:00:00+00	2026-01-14 01:00:00+00	\N	2026-01-08 04:00:00+00
20	00000000-0000-0000-0000-000000001043	20	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-04-09 luc 16:00.	Da gui	2026-04-08 01:00:00+00	2026-04-08 01:00:00+00	2026-04-08 09:05:00+00	2026-04-02 09:00:00+00
21	00000000-0000-0000-0000-000000001049	21	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-04 luc 09:30.	Da gui	2026-01-03 01:00:00+00	2026-01-03 01:00:00+00	\N	2025-12-28 02:30:00+00
22	00000000-0000-0000-0000-000000001010	22	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-13 luc 12:00.	Da gui	2026-02-12 01:00:00+00	2026-02-12 01:00:00+00	2026-02-12 05:05:00+00	2026-02-06 05:00:00+00
23	00000000-0000-0000-0000-000000001048	23	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-26 luc 13:00.	Da gui	2026-03-25 01:00:00+00	2026-03-25 01:00:00+00	2026-03-25 06:05:00+00	2026-03-19 06:00:00+00
24	00000000-0000-0000-0000-000000001027	24	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-01-12 luc 15:00.	Da gui	2026-01-11 01:00:00+00	2026-01-11 01:00:00+00	2026-01-11 08:05:00+00	2026-01-05 08:00:00+00
25	00000000-0000-0000-0000-000000001047	25	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-13 luc 09:30.	Da gui	2026-02-12 01:00:00+00	2026-02-12 01:00:00+00	2026-02-12 02:35:00+00	2026-02-06 02:30:00+00
26	00000000-0000-0000-0000-000000001004	26	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-04-10 luc 16:00.	Da gui	2026-04-09 01:00:00+00	2026-04-09 01:00:00+00	\N	2026-04-03 09:00:00+00
27	00000000-0000-0000-0000-000000001006	27	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-21 luc 16:00.	Da gui	2026-01-20 01:00:00+00	2026-01-20 01:00:00+00	\N	2026-01-14 09:00:00+00
28	00000000-0000-0000-0000-000000001029	28	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-26 luc 13:30.	Da gui	2026-02-25 01:00:00+00	2026-02-25 01:00:00+00	2026-02-25 06:35:00+00	2026-02-19 06:30:00+00
29	00000000-0000-0000-0000-000000001028	29	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-04 luc 10:00.	Da gui	2026-02-03 01:00:00+00	2026-02-03 01:00:00+00	2026-02-03 03:05:00+00	2026-01-28 03:00:00+00
30	00000000-0000-0000-0000-000000001043	30	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-06 luc 16:30.	Da gui	2026-02-05 01:00:00+00	2026-02-05 01:00:00+00	2026-02-05 09:35:00+00	2026-01-30 09:30:00+00
31	00000000-0000-0000-0000-000000001004	31	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-06 luc 10:30.	Da gui	2026-01-05 01:00:00+00	2026-01-05 01:00:00+00	2026-01-05 03:35:00+00	2025-12-30 03:30:00+00
32	00000000-0000-0000-0000-000000001009	32	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-27 luc 11:00.	Da gui	2026-01-26 01:00:00+00	2026-01-26 01:00:00+00	\N	2026-01-20 04:00:00+00
33	00000000-0000-0000-0000-000000001032	33	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-07 luc 12:00.	Da gui	2026-02-06 01:00:00+00	2026-02-06 01:00:00+00	2026-02-06 05:05:00+00	2026-01-31 05:00:00+00
34	00000000-0000-0000-0000-000000001046	34	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-01-23 luc 09:30.	Da gui	2026-01-22 01:00:00+00	2026-01-22 01:00:00+00	2026-01-22 02:35:00+00	2026-01-16 02:30:00+00
35	00000000-0000-0000-0000-000000001026	35	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-06 luc 15:30.	Da gui	2026-03-05 01:00:00+00	2026-03-05 01:00:00+00	2026-03-05 08:35:00+00	2026-02-27 08:30:00+00
36	00000000-0000-0000-0000-000000001005	36	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-25 luc 07:30.	Da gui	2026-02-24 01:00:00+00	2026-02-24 01:00:00+00	\N	2026-02-18 00:30:00+00
37	00000000-0000-0000-0000-000000001041	37	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-15 luc 13:30.	Da gui	2026-03-14 01:00:00+00	2026-03-14 01:00:00+00	\N	2026-03-08 06:30:00+00
38	00000000-0000-0000-0000-000000001021	38	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-02-07 luc 08:30.	Da gui	2026-02-06 01:00:00+00	2026-02-06 01:00:00+00	2026-02-06 01:35:00+00	2026-01-31 01:30:00+00
39	00000000-0000-0000-0000-000000001045	39	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-04-13 luc 16:30.	Da gui	2026-04-12 01:00:00+00	2026-04-12 01:00:00+00	\N	2026-04-06 09:30:00+00
40	00000000-0000-0000-0000-000000001028	40	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-12 luc 13:00.	Da gui	2026-01-11 01:00:00+00	2026-01-11 01:00:00+00	2026-01-11 06:05:00+00	2026-01-05 06:00:00+00
41	00000000-0000-0000-0000-000000001020	41	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-21 luc 15:00.	Da gui	2026-02-20 01:00:00+00	2026-02-20 01:00:00+00	2026-02-20 08:05:00+00	2026-02-14 08:00:00+00
42	00000000-0000-0000-0000-000000001033	42	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-29 luc 12:00.	Da gui	2026-01-28 01:00:00+00	2026-01-28 01:00:00+00	2026-01-28 05:05:00+00	2026-01-22 05:00:00+00
43	00000000-0000-0000-0000-000000001050	43	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-03-09 luc 15:00.	Da gui	2026-03-08 01:00:00+00	2026-03-08 01:00:00+00	\N	2026-03-02 08:00:00+00
44	00000000-0000-0000-0000-000000001010	44	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-14 luc 09:00.	Da gui	2026-02-13 01:00:00+00	2026-02-13 01:00:00+00	2026-02-13 02:05:00+00	2026-02-07 02:00:00+00
45	00000000-0000-0000-0000-000000001049	45	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-26 luc 09:00.	Da gui	2026-01-25 01:00:00+00	2026-01-25 01:00:00+00	\N	2026-01-19 02:00:00+00
46	00000000-0000-0000-0000-000000001037	46	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-23 luc 14:30.	Da gui	2026-01-22 01:00:00+00	2026-01-22 01:00:00+00	\N	2026-01-16 07:30:00+00
47	00000000-0000-0000-0000-000000001041	47	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-27 luc 16:30.	Da gui	2026-02-26 01:00:00+00	2026-02-26 01:00:00+00	\N	2026-02-20 09:30:00+00
48	00000000-0000-0000-0000-000000001029	48	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-20 luc 14:00.	Da gui	2026-01-19 01:00:00+00	2026-01-19 01:00:00+00	2026-01-19 07:05:00+00	2026-01-13 07:00:00+00
49	00000000-0000-0000-0000-000000001033	49	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-04-12 luc 11:00.	Da gui	2026-04-11 01:00:00+00	2026-04-11 01:00:00+00	2026-04-11 04:05:00+00	2026-04-05 04:00:00+00
50	00000000-0000-0000-0000-000000001004	50	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-09 luc 14:30.	Da gui	2026-02-08 01:00:00+00	2026-02-08 01:00:00+00	2026-02-08 07:35:00+00	2026-02-02 07:30:00+00
51	00000000-0000-0000-0000-000000001006	51	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-04-17 luc 11:00.	Da gui	2026-04-16 01:00:00+00	2026-04-16 01:00:00+00	\N	2026-04-10 04:00:00+00
52	00000000-0000-0000-0000-000000001038	52	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-18 luc 15:30.	Da gui	2026-03-17 01:00:00+00	2026-03-17 01:00:00+00	2026-03-17 08:35:00+00	2026-03-11 08:30:00+00
53	00000000-0000-0000-0000-000000001037	53	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-04-12 luc 07:30.	Da gui	2026-04-11 01:00:00+00	2026-04-11 01:00:00+00	\N	2026-04-05 00:30:00+00
54	00000000-0000-0000-0000-000000001010	54	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-11 luc 16:30.	Da gui	2026-02-10 01:00:00+00	2026-02-10 01:00:00+00	2026-02-10 09:35:00+00	2026-02-04 09:30:00+00
55	00000000-0000-0000-0000-000000001006	55	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-27 luc 08:30.	Da gui	2026-02-26 01:00:00+00	2026-02-26 01:00:00+00	\N	2026-02-20 01:30:00+00
56	00000000-0000-0000-0000-000000001046	56	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-24 luc 09:00.	Da gui	2026-03-23 01:00:00+00	2026-03-23 01:00:00+00	2026-03-23 02:05:00+00	2026-03-17 02:00:00+00
57	00000000-0000-0000-0000-000000001024	57	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-26 luc 15:00.	Da gui	2026-02-25 01:00:00+00	2026-02-25 01:00:00+00	2026-02-25 08:05:00+00	2026-02-19 08:00:00+00
58	00000000-0000-0000-0000-000000001039	58	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-19 luc 13:30.	Da gui	2026-02-18 01:00:00+00	2026-02-18 01:00:00+00	\N	2026-02-12 06:30:00+00
59	00000000-0000-0000-0000-000000001007	59	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-04-12 luc 12:00.	Da gui	2026-04-11 01:00:00+00	2026-04-11 01:00:00+00	2026-04-11 05:05:00+00	2026-04-05 05:00:00+00
60	00000000-0000-0000-0000-000000001047	60	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-28 luc 13:30.	Da gui	2026-03-27 01:00:00+00	2026-03-27 01:00:00+00	2026-03-27 06:35:00+00	2026-03-21 06:30:00+00
61	00000000-0000-0000-0000-000000001038	61	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-04-22 luc 09:30.	Da gui	2026-04-21 01:00:00+00	2026-04-21 01:00:00+00	2026-04-21 02:35:00+00	2026-04-15 02:30:00+00
62	00000000-0000-0000-0000-000000001039	62	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-14 luc 11:30.	Da gui	2026-02-13 01:00:00+00	2026-02-13 01:00:00+00	2026-02-13 04:35:00+00	2026-02-07 04:30:00+00
63	00000000-0000-0000-0000-000000001022	63	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-02-09 luc 15:30.	Da gui	2026-02-08 01:00:00+00	2026-02-08 01:00:00+00	\N	2026-02-02 08:30:00+00
64	00000000-0000-0000-0000-000000001043	64	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-27 luc 15:00.	Da gui	2026-03-26 01:00:00+00	2026-03-26 01:00:00+00	\N	2026-03-20 08:00:00+00
65	00000000-0000-0000-0000-000000001020	65	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-03-07 luc 12:00.	Da gui	2026-03-06 01:00:00+00	2026-03-06 01:00:00+00	2026-03-06 05:05:00+00	2026-02-28 05:00:00+00
66	00000000-0000-0000-0000-000000001015	66	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-01-28 luc 12:30.	Da gui	2026-01-27 01:00:00+00	2026-01-27 01:00:00+00	2026-01-27 05:35:00+00	2026-01-21 05:30:00+00
67	00000000-0000-0000-0000-000000001007	67	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-20 luc 08:30.	Da gui	2026-01-19 01:00:00+00	2026-01-19 01:00:00+00	\N	2026-01-13 01:30:00+00
68	00000000-0000-0000-0000-000000001022	68	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-04-09 luc 15:00.	Da gui	2026-04-08 01:00:00+00	2026-04-08 01:00:00+00	\N	2026-04-02 08:00:00+00
69	00000000-0000-0000-0000-000000001011	69	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-01-17 luc 16:30.	Da gui	2026-01-16 01:00:00+00	2026-01-16 01:00:00+00	2026-01-16 09:35:00+00	2026-01-10 09:30:00+00
70	00000000-0000-0000-0000-000000001029	70	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-04-17 luc 16:00.	Da gui	2026-04-16 01:00:00+00	2026-04-16 01:00:00+00	\N	2026-04-10 09:00:00+00
71	00000000-0000-0000-0000-000000001040	71	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-22 luc 12:00.	Da gui	2026-02-21 01:00:00+00	2026-02-21 01:00:00+00	2026-02-21 05:05:00+00	2026-02-15 05:00:00+00
72	00000000-0000-0000-0000-000000001016	72	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-04-07 luc 14:00.	Da gui	2026-04-06 01:00:00+00	2026-04-06 01:00:00+00	2026-04-06 07:05:00+00	2026-03-31 07:00:00+00
73	00000000-0000-0000-0000-000000001044	73	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-04-14 luc 14:00.	Da gui	2026-04-13 01:00:00+00	2026-04-13 01:00:00+00	2026-04-13 07:05:00+00	2026-04-07 07:00:00+00
74	00000000-0000-0000-0000-000000001025	74	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-26 luc 14:30.	Da gui	2026-02-25 01:00:00+00	2026-02-25 01:00:00+00	\N	2026-02-19 07:30:00+00
75	00000000-0000-0000-0000-000000001013	75	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-09 luc 13:00.	Da gui	2026-03-08 01:00:00+00	2026-03-08 01:00:00+00	\N	2026-03-02 06:00:00+00
76	00000000-0000-0000-0000-000000001031	76	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-18 luc 11:00.	Da gui	2026-01-17 01:00:00+00	2026-01-17 01:00:00+00	\N	2026-01-11 04:00:00+00
77	00000000-0000-0000-0000-000000001006	77	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-03-12 luc 08:00.	Da gui	2026-03-11 01:00:00+00	2026-03-11 01:00:00+00	2026-03-11 01:05:00+00	2026-03-05 01:00:00+00
78	00000000-0000-0000-0000-000000001028	78	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-04 luc 14:00.	Da gui	2026-02-03 01:00:00+00	2026-02-03 01:00:00+00	\N	2026-01-28 07:00:00+00
79	00000000-0000-0000-0000-000000001002	79	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-01-29 luc 14:30.	Da gui	2026-01-28 01:00:00+00	2026-01-28 01:00:00+00	\N	2026-01-22 07:30:00+00
80	00000000-0000-0000-0000-000000001025	80	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-01-07 luc 13:30.	Da gui	2026-01-06 01:00:00+00	2026-01-06 01:00:00+00	2026-01-06 06:35:00+00	2025-12-31 06:30:00+00
81	00000000-0000-0000-0000-000000001007	81	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-17 luc 10:00.	Da gui	2026-02-16 01:00:00+00	2026-02-16 01:00:00+00	2026-02-16 03:05:00+00	2026-02-10 03:00:00+00
82	00000000-0000-0000-0000-000000001019	82	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-04-12 luc 09:00.	Da gui	2026-04-11 01:00:00+00	2026-04-11 01:00:00+00	2026-04-11 02:05:00+00	2026-04-05 02:00:00+00
83	00000000-0000-0000-0000-000000001040	83	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-31 luc 09:30.	Da gui	2026-03-30 01:00:00+00	2026-03-30 01:00:00+00	2026-03-30 02:35:00+00	2026-03-24 02:30:00+00
84	00000000-0000-0000-0000-000000001010	84	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-11 luc 07:30.	Da gui	2026-01-10 01:00:00+00	2026-01-10 01:00:00+00	2026-01-10 00:35:00+00	2026-01-04 00:30:00+00
85	00000000-0000-0000-0000-000000001050	85	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-04-04 luc 16:30.	Da gui	2026-04-03 01:00:00+00	2026-04-03 01:00:00+00	2026-04-03 09:35:00+00	2026-03-28 09:30:00+00
86	00000000-0000-0000-0000-000000001016	86	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-01-31 luc 11:00.	Da gui	2026-01-30 01:00:00+00	2026-01-30 01:00:00+00	2026-01-30 04:05:00+00	2026-01-24 04:00:00+00
87	00000000-0000-0000-0000-000000001008	87	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-23 luc 16:30.	Da gui	2026-03-22 01:00:00+00	2026-03-22 01:00:00+00	2026-03-22 09:35:00+00	2026-03-16 09:30:00+00
88	00000000-0000-0000-0000-000000001033	88	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-18 luc 15:00.	Da gui	2026-03-17 01:00:00+00	2026-03-17 01:00:00+00	\N	2026-03-11 08:00:00+00
89	00000000-0000-0000-0000-000000001001	89	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-01-31 luc 09:30.	Da gui	2026-01-30 01:00:00+00	2026-01-30 01:00:00+00	2026-01-30 02:35:00+00	2026-01-24 02:30:00+00
90	00000000-0000-0000-0000-000000001043	90	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-15 luc 10:30.	Da gui	2026-02-14 01:00:00+00	2026-02-14 01:00:00+00	2026-02-14 03:35:00+00	2026-02-08 03:30:00+00
91	00000000-0000-0000-0000-000000001035	91	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-03-09 luc 12:00.	Da gui	2026-03-08 01:00:00+00	2026-03-08 01:00:00+00	2026-03-08 05:05:00+00	2026-03-02 05:00:00+00
92	00000000-0000-0000-0000-000000001031	92	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-04-11 luc 15:00.	Da gui	2026-04-10 01:00:00+00	2026-04-10 01:00:00+00	2026-04-10 08:05:00+00	2026-04-04 08:00:00+00
93	00000000-0000-0000-0000-000000001048	93	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-23 luc 13:30.	Da gui	2026-03-22 01:00:00+00	2026-03-22 01:00:00+00	2026-03-22 06:35:00+00	2026-03-16 06:30:00+00
94	00000000-0000-0000-0000-000000001047	94	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-02-15 luc 08:30.	Da gui	2026-02-14 01:00:00+00	2026-02-14 01:00:00+00	2026-02-14 01:35:00+00	2026-02-08 01:30:00+00
95	00000000-0000-0000-0000-000000001003	95	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-04-09 luc 16:30.	Da gui	2026-04-08 01:00:00+00	2026-04-08 01:00:00+00	2026-04-08 09:35:00+00	2026-04-02 09:30:00+00
96	00000000-0000-0000-0000-000000001050	96	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-11 luc 12:00.	Da gui	2026-03-10 01:00:00+00	2026-03-10 01:00:00+00	\N	2026-03-04 05:00:00+00
97	00000000-0000-0000-0000-000000001009	97	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-31 luc 14:00.	Da gui	2026-03-30 01:00:00+00	2026-03-30 01:00:00+00	\N	2026-03-24 07:00:00+00
98	00000000-0000-0000-0000-000000001013	98	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-04-02 luc 14:00.	Da gui	2026-04-01 01:00:00+00	2026-04-01 01:00:00+00	2026-04-01 07:05:00+00	2026-03-26 07:00:00+00
99	00000000-0000-0000-0000-000000001020	99	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-04-12 luc 10:00.	Da gui	2026-04-11 01:00:00+00	2026-04-11 01:00:00+00	2026-04-11 03:05:00+00	2026-04-05 03:00:00+00
100	00000000-0000-0000-0000-000000001003	100	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-02-20 luc 15:30.	Da gui	2026-02-19 01:00:00+00	2026-02-19 01:00:00+00	2026-02-19 08:35:00+00	2026-02-13 08:30:00+00
101	00000000-0000-0000-0000-000000001042	101	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-06 luc 12:00.	Da gui	2026-02-05 01:00:00+00	2026-02-05 01:00:00+00	\N	2026-01-30 05:00:00+00
102	00000000-0000-0000-0000-000000001026	102	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-04 luc 08:30.	Da gui	2026-02-03 01:00:00+00	2026-02-03 01:00:00+00	2026-02-03 01:35:00+00	2026-01-28 01:30:00+00
103	00000000-0000-0000-0000-000000001045	103	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-19 luc 12:00.	Da gui	2026-02-18 01:00:00+00	2026-02-18 01:00:00+00	2026-02-18 05:05:00+00	2026-02-12 05:00:00+00
104	00000000-0000-0000-0000-000000001006	104	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-17 luc 15:30.	Da gui	2026-02-16 01:00:00+00	2026-02-16 01:00:00+00	\N	2026-02-10 08:30:00+00
105	00000000-0000-0000-0000-000000001019	105	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-11 luc 13:00.	Da gui	2026-01-10 01:00:00+00	2026-01-10 01:00:00+00	2026-01-10 06:05:00+00	2026-01-04 06:00:00+00
106	00000000-0000-0000-0000-000000001019	106	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-01-14 luc 08:30.	Da gui	2026-01-13 01:00:00+00	2026-01-13 01:00:00+00	\N	2026-01-07 01:30:00+00
107	00000000-0000-0000-0000-000000001045	107	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-27 luc 16:30.	Da gui	2026-02-26 01:00:00+00	2026-02-26 01:00:00+00	2026-02-26 09:35:00+00	2026-02-20 09:30:00+00
108	00000000-0000-0000-0000-000000001023	108	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-14 luc 14:00.	Da gui	2026-02-13 01:00:00+00	2026-02-13 01:00:00+00	\N	2026-02-07 07:00:00+00
109	00000000-0000-0000-0000-000000001043	109	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-02-25 luc 11:00.	Da gui	2026-02-24 01:00:00+00	2026-02-24 01:00:00+00	2026-02-24 04:05:00+00	2026-02-18 04:00:00+00
110	00000000-0000-0000-0000-000000001010	110	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 5 vao 2026-02-16 luc 15:00.	Da gui	2026-02-15 01:00:00+00	2026-02-15 01:00:00+00	2026-02-15 08:05:00+00	2026-02-09 08:00:00+00
111	00000000-0000-0000-0000-000000001005	111	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-03-28 luc 14:00.	Da gui	2026-03-27 01:00:00+00	2026-03-27 01:00:00+00	2026-03-27 07:05:00+00	2026-03-21 07:00:00+00
112	00000000-0000-0000-0000-000000001037	112	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-04-10 luc 12:30.	Da gui	2026-04-09 01:00:00+00	2026-04-09 01:00:00+00	2026-04-09 05:35:00+00	2026-04-03 05:30:00+00
113	00000000-0000-0000-0000-000000001024	113	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-03-19 luc 09:30.	Da gui	2026-03-18 01:00:00+00	2026-03-18 01:00:00+00	2026-03-18 02:35:00+00	2026-03-12 02:30:00+00
114	00000000-0000-0000-0000-000000001024	114	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 4 vao 2026-04-08 luc 08:00.	Da gui	2026-04-07 01:00:00+00	2026-04-07 01:00:00+00	2026-04-07 01:05:00+00	2026-04-01 01:00:00+00
115	00000000-0000-0000-0000-000000001002	115	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 2 vao 2026-02-10 luc 11:00.	Da gui	2026-02-09 01:00:00+00	2026-02-09 01:00:00+00	2026-02-09 04:05:00+00	2026-02-03 04:00:00+00
116	00000000-0000-0000-0000-000000001036	116	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-05 luc 15:30.	Da gui	2026-03-04 01:00:00+00	2026-03-04 01:00:00+00	\N	2026-02-26 08:30:00+00
117	00000000-0000-0000-0000-000000001040	117	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-03 luc 11:30.	Da gui	2026-02-02 01:00:00+00	2026-02-02 01:00:00+00	2026-02-02 04:35:00+00	2026-01-27 04:30:00+00
118	00000000-0000-0000-0000-000000001009	118	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 1 vao 2026-03-30 luc 14:00.	Da gui	2026-03-29 01:00:00+00	2026-03-29 01:00:00+00	2026-03-29 07:05:00+00	2026-03-23 07:00:00+00
119	00000000-0000-0000-0000-000000001044	119	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-02-27 luc 09:30.	Da gui	2026-02-26 01:00:00+00	2026-02-26 01:00:00+00	2026-02-26 02:35:00+00	2026-02-20 02:30:00+00
120	00000000-0000-0000-0000-000000001035	120	Nhac lich	He thong	Nhac lich kham	Ban co lich kham voi bac si 3 vao 2026-03-27 luc 12:00.	Da gui	2026-03-26 01:00:00+00	2026-03-26 01:00:00+00	2026-03-26 05:05:00+00	2026-03-20 05:00:00+00
\.


--
-- Data for Name: thuoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.thuoc (id, ten_thuoc, hoat_chat, ham_luong, don_vi, don_gia, so_luong_ton, han_su_dung, nha_san_xuat, dang_hoat_dong, ngay_tao, ngay_cap_nhat) FROM stdin;
1	Paracetamol	Paracetamol	500 mg	Vien	12000.00	240	2027-02-27	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
2	Amoxicillin	Amoxicillin	500 mg	Vien	18000.00	145	2026-10-21	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
3	Azithromycin	Azithromycin	250 mg	Goi	5000.00	58	2026-10-10	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
4	Ibuprofen	Ibuprofen	400 mg	Vien	10000.00	50	2028-07-20	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
5	Cetirizine	Cetirizine	10 mg	Chai	30000.00	77	2028-07-15	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
6	Loratadine	Loratadine	10 mg	Ong	12000.00	240	2028-07-10	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
7	Omeprazole	Omeprazole	20 mg	Chai	30000.00	35	2028-12-04	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
8	Esomeprazole	Esomeprazole	20 mg	Hop	35000.00	74	2027-11-03	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
9	Metformin	Metformin	500 mg	Hop	10000.00	64	2028-02-06	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
10	Amlodipine	Amlodipine	5 mg	Vien	18000.00	135	2028-10-16	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
11	Losartan	Losartan	50 mg	Vao	5000.00	79	2027-12-10	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
12	Atorvastatin	Atorvastatin	10 mg	Goi	20000.00	38	2028-04-09	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
13	Simvastatin	Simvastatin	20 mg	Goi	30000.00	189	2026-07-04	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
14	Dextromethorphan	Dextromethorphan	15 mg	Chai	10000.00	185	2026-05-27	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
15	Bromhexine	Bromhexine	8 mg	Hop	7000.00	35	2026-05-20	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
16	Ambroxol	Ambroxol	30 mg	Goi	30000.00	93	2027-02-15	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
17	Vitamin C	Vitamin C	500 mg	Goi	12000.00	199	2027-05-17	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
18	Zinc	Zinc	10 mg	Chai	20000.00	132	2026-10-02	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
19	Calcium	Calcium	500 mg	Ong	40000.00	102	2028-05-01	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
20	Magnesium	Magnesium	250 mg	Vien	10000.00	192	2028-10-01	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
21	Pantoprazole	Pantoprazole	40 mg	Goi	12000.00	167	2026-03-16	Duoc Hau Giang	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
22	Domperidone	Domperidone	10 mg	Chai	35000.00	133	2027-03-19	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
23	Gaviscon	Gaviscon	10 ml	Ong	35000.00	228	2027-02-16	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
24	ORS	ORS	1 goi	Vao	18000.00	105	2027-11-04	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
25	Prednisolone	Prednisolone	5 mg	Hop	15000.00	125	2028-08-10	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
26	Paracetamol 2	Paracetamol	500 mg	Goi	18000.00	228	2028-01-15	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
27	Amoxicillin 2	Amoxicillin	500 mg	Vien	15000.00	84	2027-02-25	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
28	Azithromycin 2	Azithromycin	250 mg	Ong	25000.00	231	2026-11-28	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
29	Ibuprofen 2	Ibuprofen	400 mg	Chai	20000.00	125	2026-04-17	Domesco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
30	Cetirizine 2	Cetirizine	10 mg	Vao	30000.00	213	2027-11-15	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
31	Loratadine 2	Loratadine	10 mg	Vien	10000.00	88	2028-03-10	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
32	Omeprazole 2	Omeprazole	20 mg	Ong	40000.00	144	2026-01-21	Traphaco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
33	Esomeprazole 2	Esomeprazole	20 mg	Chai	10000.00	201	2026-05-18	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
34	Metformin 2	Metformin	500 mg	Vien	25000.00	124	2026-04-27	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
35	Amlodipine 2	Amlodipine	5 mg	Vien	20000.00	50	2028-03-16	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
36	Losartan 2	Losartan	50 mg	Goi	12000.00	150	2028-05-14	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
37	Atorvastatin 2	Atorvastatin	10 mg	Ong	20000.00	82	2027-09-05	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
38	Simvastatin 2	Simvastatin	20 mg	Ong	10000.00	173	2028-12-05	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
39	Dextromethorphan 2	Dextromethorphan	15 mg	Vien	12000.00	217	2027-06-26	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
40	Bromhexine 2	Bromhexine	8 mg	Chai	12000.00	230	2026-05-24	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
41	Ambroxol 2	Ambroxol	30 mg	Vao	30000.00	168	2028-08-28	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
42	Vitamin C 2	Vitamin C	500 mg	Hop	20000.00	157	2027-06-11	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
43	Zinc 2	Zinc	10 mg	Chai	25000.00	116	2027-06-28	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
44	Calcium 2	Calcium	500 mg	Hop	40000.00	81	2028-07-08	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
45	Magnesium 2	Magnesium	250 mg	Ong	5000.00	101	2028-08-23	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
46	Pantoprazole 2	Pantoprazole	40 mg	Ong	18000.00	189	2028-03-16	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
47	Domperidone 2	Domperidone	10 mg	Vien	8000.00	148	2028-06-28	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
48	Gaviscon 2	Gaviscon	10 ml	Vien	20000.00	45	2028-08-01	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
49	ORS 2	ORS	1 goi	Goi	8000.00	124	2028-03-03	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
50	Prednisolone 2	Prednisolone	5 mg	Ong	12000.00	106	2028-12-13	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
51	Paracetamol 3	Paracetamol	500 mg	Goi	7000.00	238	2027-11-28	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
52	Amoxicillin 3	Amoxicillin	500 mg	Chai	18000.00	101	2028-12-25	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
53	Azithromycin 3	Azithromycin	250 mg	Ong	25000.00	29	2028-02-08	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
54	Ibuprofen 3	Ibuprofen	400 mg	Goi	35000.00	93	2026-12-03	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
55	Cetirizine 3	Cetirizine	10 mg	Ong	7000.00	214	2028-12-28	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
56	Loratadine 3	Loratadine	10 mg	Vien	20000.00	62	2028-05-01	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
57	Omeprazole 3	Omeprazole	20 mg	Vien	15000.00	223	2026-05-12	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
58	Esomeprazole 3	Esomeprazole	20 mg	Vao	18000.00	57	2026-09-14	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
59	Metformin 3	Metformin	500 mg	Chai	35000.00	222	2026-03-06	Domesco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
60	Amlodipine 3	Amlodipine	5 mg	Vien	30000.00	242	2027-10-22	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
61	Losartan 3	Losartan	50 mg	Hop	20000.00	169	2026-04-15	Duoc Hau Giang	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
62	Atorvastatin 3	Atorvastatin	10 mg	Goi	12000.00	137	2027-11-01	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
63	Simvastatin 3	Simvastatin	20 mg	Ong	12000.00	193	2028-03-03	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
64	Dextromethorphan 3	Dextromethorphan	15 mg	Ong	15000.00	170	2027-11-14	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
65	Bromhexine 3	Bromhexine	8 mg	Goi	12000.00	136	2027-04-13	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
66	Ambroxol 3	Ambroxol	30 mg	Ong	7000.00	80	2027-10-12	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
67	Vitamin C 3	Vitamin C	500 mg	Chai	12000.00	199	2027-01-27	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
68	Zinc 3	Zinc	10 mg	Goi	18000.00	90	2026-10-28	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
69	Calcium 3	Calcium	500 mg	Goi	40000.00	32	2028-12-16	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
70	Magnesium 3	Magnesium	250 mg	Vao	10000.00	175	2027-04-21	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
71	Pantoprazole 3	Pantoprazole	40 mg	Hop	30000.00	84	2028-12-25	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
72	Domperidone 3	Domperidone	10 mg	Goi	35000.00	234	2026-11-04	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
73	Gaviscon 3	Gaviscon	10 ml	Goi	35000.00	30	2027-08-02	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
74	ORS 3	ORS	1 goi	Chai	15000.00	207	2026-02-10	Domesco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
75	Prednisolone 3	Prednisolone	5 mg	Vao	40000.00	126	2026-04-05	Pymepharco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
76	Paracetamol 4	Paracetamol	500 mg	Chai	15000.00	155	2028-05-27	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
77	Amoxicillin 4	Amoxicillin	500 mg	Hop	12000.00	231	2027-05-24	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
78	Azithromycin 4	Azithromycin	250 mg	Vao	7000.00	139	2026-03-25	Imexpharm	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
79	Ibuprofen 4	Ibuprofen	400 mg	Hop	35000.00	205	2028-07-28	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
80	Cetirizine 4	Cetirizine	10 mg	Chai	15000.00	43	2027-01-09	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
81	Loratadine 4	Loratadine	10 mg	Chai	7000.00	136	2027-11-24	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
82	Omeprazole 4	Omeprazole	20 mg	Goi	12000.00	169	2027-11-12	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
83	Esomeprazole 4	Esomeprazole	20 mg	Vien	35000.00	79	2027-01-20	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
84	Metformin 4	Metformin	500 mg	Chai	15000.00	176	2026-11-03	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
85	Amlodipine 4	Amlodipine	5 mg	Goi	20000.00	199	2027-11-14	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
86	Losartan 4	Losartan	50 mg	Vien	8000.00	31	2026-05-16	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
87	Atorvastatin 4	Atorvastatin	10 mg	Vien	7000.00	80	2028-03-13	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
88	Simvastatin 4	Simvastatin	20 mg	Ong	15000.00	191	2028-12-18	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
89	Dextromethorphan 4	Dextromethorphan	15 mg	Ong	30000.00	210	2028-03-14	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
90	Bromhexine 4	Bromhexine	8 mg	Goi	7000.00	233	2027-10-14	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
91	Ambroxol 4	Ambroxol	30 mg	Vao	5000.00	196	2027-04-15	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
92	Vitamin C 4	Vitamin C	500 mg	Ong	10000.00	238	2027-02-22	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
93	Zinc 4	Zinc	10 mg	Vao	25000.00	250	2028-06-02	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
94	Calcium 4	Calcium	500 mg	Ong	12000.00	68	2026-08-03	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
95	Magnesium 4	Magnesium	250 mg	Goi	10000.00	184	2028-10-01	Pymepharco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
96	Pantoprazole 4	Pantoprazole	40 mg	Vien	15000.00	82	2026-10-07	Duoc Hau Giang	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
97	Domperidone 4	Domperidone	10 mg	Vien	25000.00	73	2028-04-27	Traphaco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
98	Gaviscon 4	Gaviscon	10 ml	Hop	15000.00	218	2026-10-01	Imexpharm	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
99	ORS 4	ORS	1 goi	Vao	8000.00	53	2028-05-26	Domesco	t	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
100	Prednisolone 4	Prednisolone	5 mg	Hop	7000.00	189	2026-03-01	Pymepharco	f	2026-01-01 01:00:00+00	2026-10-07 14:47:00.431927+00
\.


--
-- Data for Name: tien_su_benh; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tien_su_benh (id, benh_nhan_id, loai_tien_su, mo_ta, ngay_phat_hien, ghi_chu, ngay_tao) FROM stdin;
1	1	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
2	2	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
3	3	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
4	4	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
5	5	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
6	6	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
7	7	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
8	8	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
9	9	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
10	10	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
11	11	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
12	12	Khong co	Khong	\N	\N	2026-01-01 01:00:00+00
13	13	Khong co	Khong	\N	\N	2026-01-01 01:00:00+00
14	14	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
15	15	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
16	16	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
17	17	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
18	18	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
19	19	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
20	20	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
21	21	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
22	22	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
23	23	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
24	24	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
25	25	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
26	26	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
27	27	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
28	28	Khong co	Khong	\N	\N	2026-01-01 01:00:00+00
29	29	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
30	30	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
31	31	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
32	32	Khong co	Khong	\N	\N	2026-01-01 01:00:00+00
33	33	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
34	34	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
35	35	Benh nen	Tieu duong	\N	\N	2026-01-01 01:00:00+00
36	36	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
37	37	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
38	38	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
39	39	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
40	40	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
41	41	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
42	42	Khong co	Khong co	\N	\N	2026-01-01 01:00:00+00
43	43	Benh nen	Hen suyen	\N	\N	2026-01-01 01:00:00+00
44	44	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
45	45	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
46	46	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
47	47	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
48	48	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
49	49	Benh nen	Tang huyet ap	\N	\N	2026-01-01 01:00:00+00
50	50	Di ung	Di ung	\N	\N	2026-01-01 01:00:00+00
\.


--
-- Data for Name: tiep_nhan_benh_nhan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tiep_nhan_benh_nhan (id, lich_hen_id, can_nang, chieu_cao, nhiet_do, huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, trieu_chung_ban_dau, ghi_chu, thoi_gian_ghi_nhan) FROM stdin;
1	1	51.00	156.00	36.5	109	69	65	97.00	Dau nguc, hoi hop	\N	2026-02-15 03:20:00+00
2	2	52.00	157.00	36.6	110	70	66	98.00	Dau bung, buon non	\N	2026-01-07 02:20:00+00
3	3	53.00	158.00	36.7	111	71	67	99.00	Kho tho, ho khan	\N	2026-03-02 07:20:00+00
4	4	54.00	159.00	36.8	112	72	68	96.00	Dau bung, buon non	\N	2026-02-27 07:50:00+00
5	5	55.00	160.00	36.9	113	73	69	97.00	Dau dau, sot nhe	\N	2026-02-08 06:50:00+00
6	7	56.00	161.00	36.4	114	74	70	98.00	Dau hong, nghen mui	\N	2026-01-11 04:50:00+00
7	8	57.00	162.00	36.5	115	75	71	99.00	Dau bung, buon non	\N	2026-03-21 09:20:00+00
8	9	58.00	163.00	36.6	116	76	72	96.00	Dau nguc, hoi hop	\N	2026-02-07 07:20:00+00
9	10	59.00	164.00	36.7	117	77	73	97.00	Noi man ngua	\N	2026-04-20 07:50:00+00
10	11	60.00	165.00	36.8	118	78	74	98.00	Ho, sot, met moi	\N	2026-02-22 05:20:00+00
11	13	61.00	166.00	36.9	119	79	75	99.00	Ho, sot, met moi	\N	2026-01-20 06:50:00+00
12	16	62.00	167.00	36.4	120	80	76	96.00	Dau hong, nghen mui	\N	2026-02-15 05:50:00+00
13	17	63.00	168.00	36.5	121	81	77	97.00	Dau bung, buon non	\N	2026-02-15 00:50:00+00
14	20	64.00	169.00	36.6	122	82	78	98.00	Dau dau, sot nhe	\N	2026-04-09 08:50:00+00
15	22	65.00	170.00	36.7	123	83	79	99.00	Dau bung, buon non	\N	2026-02-13 04:50:00+00
16	23	66.00	171.00	36.8	124	68	80	96.00	Dau bung, buon non	\N	2026-03-26 05:50:00+00
17	24	67.00	172.00	36.9	125	69	81	97.00	Kho tho, ho khan	\N	2026-01-12 07:50:00+00
18	25	68.00	173.00	36.4	126	70	82	98.00	Dau nguc, hoi hop	\N	2026-02-13 02:20:00+00
19	28	69.00	174.00	36.5	127	71	83	99.00	Kho tho, ho khan	\N	2026-02-26 06:20:00+00
20	29	70.00	175.00	36.6	128	72	84	96.00	Dau nguc, hoi hop	\N	2026-02-04 02:50:00+00
21	30	71.00	155.00	36.7	129	73	85	97.00	Dau bung, buon non	\N	2026-02-06 09:20:00+00
22	31	72.00	156.00	36.8	130	74	86	98.00	Dau hong, nghen mui	\N	2026-01-06 03:20:00+00
23	33	73.00	157.00	36.9	108	75	87	99.00	Ho, sot, met moi	\N	2026-02-07 04:50:00+00
24	34	74.00	158.00	36.4	109	76	88	96.00	Dau nguc, hoi hop	\N	2026-01-23 02:20:00+00
25	35	75.00	159.00	36.5	110	77	89	97.00	Dau khop, met moi	\N	2026-03-06 08:20:00+00
26	38	50.00	160.00	36.6	111	78	90	98.00	Dau nguc, hoi hop	\N	2026-02-07 01:20:00+00
27	40	51.00	161.00	36.7	112	79	91	99.00	Kho tho, ho khan	\N	2026-01-12 05:50:00+00
28	41	52.00	162.00	36.8	113	80	64	96.00	Noi man ngua	\N	2026-02-21 07:50:00+00
29	42	53.00	163.00	36.9	114	81	65	97.00	Dau dau, sot nhe	\N	2026-01-29 04:50:00+00
30	44	54.00	164.00	36.4	115	82	66	98.00	Dau khop, met moi	\N	2026-02-14 01:50:00+00
31	48	55.00	165.00	36.5	116	83	67	99.00	Kho tho, ho khan	\N	2026-01-20 06:50:00+00
32	49	56.00	166.00	36.6	117	68	68	96.00	Dau bung, buon non	\N	2026-04-12 03:50:00+00
33	50	57.00	167.00	36.7	118	69	69	97.00	Dau hong, nghen mui	\N	2026-02-09 07:20:00+00
34	52	58.00	168.00	36.8	119	70	70	98.00	Dau bung, buon non	\N	2026-03-18 08:20:00+00
35	54	59.00	169.00	36.9	120	71	71	99.00	Ho, sot, met moi	\N	2026-02-11 09:20:00+00
36	56	60.00	170.00	36.4	121	72	72	96.00	Noi man ngua	\N	2026-03-24 01:50:00+00
37	57	61.00	171.00	36.5	122	73	73	97.00	Noi man ngua	\N	2026-02-26 07:50:00+00
38	59	62.00	172.00	36.6	123	74	74	98.00	Ho, sot, met moi	\N	2026-04-12 04:50:00+00
39	60	63.00	173.00	36.7	124	75	75	99.00	Dau khop, met moi	\N	2026-03-28 06:20:00+00
40	61	64.00	174.00	36.8	125	76	76	96.00	Dau bung, buon non	\N	2026-04-22 02:20:00+00
41	62	65.00	175.00	36.9	126	77	77	97.00	Dau hong, nghen mui	\N	2026-02-14 04:20:00+00
42	65	66.00	155.00	36.4	127	78	78	98.00	Noi man ngua	\N	2026-03-07 04:50:00+00
43	66	67.00	156.00	36.5	128	79	79	99.00	Dau nguc, hoi hop	\N	2026-01-28 05:20:00+00
44	69	68.00	157.00	36.6	129	80	80	96.00	Ho, sot, met moi	\N	2026-01-17 09:20:00+00
45	71	69.00	158.00	36.7	130	81	81	97.00	Noi man ngua	\N	2026-02-22 04:50:00+00
46	72	70.00	159.00	36.8	108	82	82	98.00	Dau hong, nghen mui	\N	2026-04-07 06:50:00+00
47	73	71.00	160.00	36.9	109	83	83	99.00	Dau nguc, hoi hop	\N	2026-04-14 06:50:00+00
48	77	72.00	161.00	36.4	110	68	84	96.00	Noi man ngua	\N	2026-03-12 00:50:00+00
49	80	73.00	162.00	36.5	111	69	85	97.00	Dau dau, sot nhe	\N	2026-01-07 06:20:00+00
50	81	74.00	163.00	36.6	112	70	86	98.00	Dau bung, buon non	\N	2026-02-17 02:50:00+00
51	82	75.00	164.00	36.7	113	71	87	99.00	Dau hong, nghen mui	\N	2026-04-12 01:50:00+00
52	83	50.00	165.00	36.8	114	72	88	96.00	Dau dau, sot nhe	\N	2026-03-31 02:20:00+00
53	84	51.00	166.00	36.9	115	73	89	97.00	Kho tho, ho khan	\N	2026-01-11 00:20:00+00
54	85	52.00	167.00	36.4	116	74	90	98.00	Dau nguc, hoi hop	\N	2026-04-04 09:20:00+00
55	86	53.00	168.00	36.5	117	75	91	99.00	Noi man ngua	\N	2026-01-31 03:50:00+00
56	87	54.00	169.00	36.6	118	76	64	96.00	Ho, sot, met moi	\N	2026-03-23 09:20:00+00
57	89	55.00	170.00	36.7	119	77	65	97.00	Dau khop, met moi	\N	2026-01-31 02:20:00+00
58	90	56.00	171.00	36.8	120	78	66	98.00	Dau hong, nghen mui	\N	2026-02-15 03:20:00+00
59	91	57.00	172.00	36.9	121	79	67	99.00	Dau khop, met moi	\N	2026-03-09 04:50:00+00
60	92	58.00	173.00	36.4	122	80	68	96.00	Dau dau, sot nhe	\N	2026-04-11 07:50:00+00
61	93	59.00	174.00	36.5	123	81	69	97.00	Dau hong, nghen mui	\N	2026-03-23 06:20:00+00
62	94	60.00	175.00	36.6	124	82	70	98.00	Noi man ngua	\N	2026-02-15 01:20:00+00
63	95	61.00	155.00	36.7	125	83	71	99.00	Dau bung, buon non	\N	2026-04-09 09:20:00+00
64	98	62.00	156.00	36.8	126	68	72	96.00	Dau hong, nghen mui	\N	2026-04-02 06:50:00+00
65	99	63.00	157.00	36.9	127	69	73	97.00	Dau nguc, hoi hop	\N	2026-04-12 02:50:00+00
66	100	64.00	158.00	36.4	128	70	74	98.00	Noi man ngua	\N	2026-02-20 08:20:00+00
67	102	65.00	159.00	36.5	129	71	75	99.00	Dau dau, sot nhe	\N	2026-02-04 01:20:00+00
68	103	66.00	160.00	36.6	130	72	76	96.00	Ho, sot, met moi	\N	2026-02-19 04:50:00+00
69	105	67.00	161.00	36.7	108	73	77	97.00	Dau nguc, hoi hop	\N	2026-01-11 05:50:00+00
70	107	68.00	162.00	36.8	109	74	78	98.00	Noi man ngua	\N	2026-02-27 09:20:00+00
71	109	69.00	163.00	36.9	110	75	79	99.00	Kho tho, ho khan	\N	2026-02-25 03:50:00+00
72	110	70.00	164.00	36.4	111	76	80	96.00	Noi man ngua	\N	2026-02-16 07:50:00+00
73	111	71.00	165.00	36.5	112	77	81	97.00	Dau khop, met moi	\N	2026-03-28 06:50:00+00
74	112	72.00	166.00	36.6	113	78	82	98.00	Kho tho, ho khan	\N	2026-04-10 05:20:00+00
75	113	73.00	167.00	36.7	114	79	83	99.00	Ho, sot, met moi	\N	2026-03-19 02:20:00+00
76	114	74.00	168.00	36.8	115	80	84	96.00	Noi man ngua	\N	2026-04-08 00:50:00+00
77	115	75.00	169.00	36.9	116	81	85	97.00	Dau bung, buon non	\N	2026-02-10 03:50:00+00
78	117	50.00	170.00	36.4	117	82	86	98.00	Kho tho, ho khan	\N	2026-02-03 04:20:00+00
79	118	51.00	171.00	36.5	118	83	87	99.00	Noi man ngua	\N	2026-03-30 06:50:00+00
80	119	52.00	172.00	36.6	119	68	88	96.00	Dau bung, buon non	\N	2026-02-27 02:20:00+00
81	120	53.00	173.00	36.7	120	69	89	97.00	Dau hong, nghen mui	\N	2026-03-27 04:50:00+00
\.


--
-- Name: bac_si_chuyen_khoa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bac_si_chuyen_khoa_id_seq', 5, true);


--
-- Name: bac_si_id_bac_si_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bac_si_id_bac_si_seq', 6, false);


--
-- Name: benh_nhan_id_benh_nhan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.benh_nhan_id_benh_nhan_seq', 51, false);


--
-- Name: chan_doan_id_chan_doan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chan_doan_id_chan_doan_seq', 82, false);


--
-- Name: chi_so_thong_ke_id_chi_so_thong_ke_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chi_so_thong_ke_id_chi_so_thong_ke_seq', 5, false);


--
-- Name: chi_tiet_don_thuoc_id_chi_tiet_don_thuoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chi_tiet_don_thuoc_id_chi_tiet_don_thuoc_seq', 189, false);


--
-- Name: chuyen_khoa_id_chuyen_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chuyen_khoa_id_chuyen_khoa_seq', 5, false);


--
-- Name: danh_muc_ten_benh_id_danh_muc_ten_benh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.danh_muc_ten_benh_id_danh_muc_ten_benh_seq', 9, false);


--
-- Name: don_thuoc_id_don_thuoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.don_thuoc_id_don_thuoc_seq', 82, false);


--
-- Name: giao_dich_kho_thuoc_id_giao_dich_kho_thuoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.giao_dich_kho_thuoc_id_giao_dich_kho_thuoc_seq', 289, false);


--
-- Name: goi_y_thuoc_id_goi_y_thuoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.goi_y_thuoc_id_goi_y_thuoc_seq', 41, false);


--
-- Name: lich_hen_id_lich_hen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lich_hen_id_lich_hen_seq', 121, false);


--
-- Name: lich_lam_viec_id_lich_lam_viec_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lich_lam_viec_id_lich_lam_viec_seq', 108, false);


--
-- Name: lich_su_lich_hen_id_lich_su_lich_hen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lich_su_lich_hen_id_lich_su_lich_hen_seq', 121, false);


--
-- Name: nhat_ky_hoat_dong_id_nhat_ky_hoat_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nhat_ky_hoat_dong_id_nhat_ky_hoat_dong_seq', 59, false);


--
-- Name: phieu_kham_id_phieu_kham_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.phieu_kham_id_phieu_kham_seq', 82, false);


--
-- Name: quan_ly_id_quan_ly_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quan_ly_id_quan_ly_seq', 2, false);


--
-- Name: thanh_toan_id_thanh_toan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thanh_toan_id_thanh_toan_seq', 33, false);


--
-- Name: thong_bao_id_thong_bao_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thong_bao_id_thong_bao_seq', 121, false);


--
-- Name: thuoc_id_thuoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thuoc_id_thuoc_seq', 101, false);


--
-- Name: tien_su_benh_id_tien_su_benh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tien_su_benh_id_tien_su_benh_seq', 51, false);


--
-- Name: tiep_nhan_benh_nhan_id_tiep_nhan_benh_nhan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tiep_nhan_benh_nhan_id_tiep_nhan_benh_nhan_seq', 82, false);


--
-- Name: bac_si_chuyen_khoa bac_si_chuyen_khoa_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si_chuyen_khoa
    ADD CONSTRAINT bac_si_chuyen_khoa_id_key UNIQUE (id);


--
-- Name: bac_si_chuyen_khoa bac_si_chuyen_khoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si_chuyen_khoa
    ADD CONSTRAINT bac_si_chuyen_khoa_pkey PRIMARY KEY (bac_si_id, chuyen_khoa_id);


--
-- Name: bac_si bac_si_id_tai_khoan_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si
    ADD CONSTRAINT bac_si_id_tai_khoan_key UNIQUE (tai_khoan_id);


--
-- Name: bac_si bac_si_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si
    ADD CONSTRAINT bac_si_pkey PRIMARY KEY (id);


--
-- Name: bac_si bac_si_so_chung_chi_hanh_nghe_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si
    ADD CONSTRAINT bac_si_so_chung_chi_hanh_nghe_key UNIQUE (so_chung_chi_hanh_nghe);


--
-- Name: benh_nhan benh_nhan_id_tai_khoan_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.benh_nhan
    ADD CONSTRAINT benh_nhan_id_tai_khoan_key UNIQUE (tai_khoan_id);


--
-- Name: benh_nhan benh_nhan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.benh_nhan
    ADD CONSTRAINT benh_nhan_pkey PRIMARY KEY (id);


--
-- Name: chan_doan chan_doan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chan_doan
    ADD CONSTRAINT chan_doan_pkey PRIMARY KEY (id);


--
-- Name: chi_so_thong_ke chi_so_thong_ke_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chi_so_thong_ke
    ADD CONSTRAINT chi_so_thong_ke_pkey PRIMARY KEY (id);


--
-- Name: chi_tiet_don_thuoc chi_tiet_don_thuoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chi_tiet_don_thuoc
    ADD CONSTRAINT chi_tiet_don_thuoc_pkey PRIMARY KEY (id);


--
-- Name: chuyen_khoa chuyen_khoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chuyen_khoa
    ADD CONSTRAINT chuyen_khoa_pkey PRIMARY KEY (id);


--
-- Name: chuyen_khoa chuyen_khoa_ten_chuyen_khoa_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chuyen_khoa
    ADD CONSTRAINT chuyen_khoa_ten_chuyen_khoa_key UNIQUE (ten_chuyen_khoa);


--
-- Name: danh_muc_ten_benh danh_muc_ten_benh_ma_benh_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danh_muc_ten_benh
    ADD CONSTRAINT danh_muc_ten_benh_ma_benh_key UNIQUE (ma_benh);


--
-- Name: danh_muc_ten_benh danh_muc_ten_benh_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danh_muc_ten_benh
    ADD CONSTRAINT danh_muc_ten_benh_pkey PRIMARY KEY (id);


--
-- Name: danh_muc_ten_benh danh_muc_ten_benh_ten_benh_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danh_muc_ten_benh
    ADD CONSTRAINT danh_muc_ten_benh_ten_benh_key UNIQUE (ten_benh);


--
-- Name: don_thuoc don_thuoc_id_phieu_kham_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT don_thuoc_id_phieu_kham_key UNIQUE (phieu_kham_id);


--
-- Name: don_thuoc don_thuoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT don_thuoc_pkey PRIMARY KEY (id);


--
-- Name: giao_dich_kho_thuoc giao_dich_kho_thuoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giao_dich_kho_thuoc
    ADD CONSTRAINT giao_dich_kho_thuoc_pkey PRIMARY KEY (id);


--
-- Name: goi_y_thuoc goi_y_thuoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goi_y_thuoc
    ADD CONSTRAINT goi_y_thuoc_pkey PRIMARY KEY (id);


--
-- Name: hoa_don hoa_don_id_phieu_kham_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoa_don
    ADD CONSTRAINT hoa_don_id_phieu_kham_key UNIQUE (phieu_kham_id);


--
-- Name: hoa_don hoa_don_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoa_don
    ADD CONSTRAINT hoa_don_pkey PRIMARY KEY (id);


--
-- Name: lich_hen lich_hen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_hen
    ADD CONSTRAINT lich_hen_pkey PRIMARY KEY (id);


--
-- Name: lich_lam_viec lich_lam_viec_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_lam_viec
    ADD CONSTRAINT lich_lam_viec_pkey PRIMARY KEY (id);


--
-- Name: lich_su_lich_hen lich_su_lich_hen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_su_lich_hen
    ADD CONSTRAINT lich_su_lich_hen_pkey PRIMARY KEY (id);


--
-- Name: nhat_ky_hoat_dong nhat_ky_hoat_dong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nhat_ky_hoat_dong
    ADD CONSTRAINT nhat_ky_hoat_dong_pkey PRIMARY KEY (id);


--
-- Name: phieu_kham phieu_kham_id_lich_hen_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT phieu_kham_id_lich_hen_key UNIQUE (lich_hen_id);


--
-- Name: phieu_kham phieu_kham_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT phieu_kham_pkey PRIMARY KEY (id);


--
-- Name: quan_ly quan_ly_id_tai_khoan_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quan_ly
    ADD CONSTRAINT quan_ly_id_tai_khoan_key UNIQUE (tai_khoan_id);


--
-- Name: quan_ly quan_ly_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quan_ly
    ADD CONSTRAINT quan_ly_pkey PRIMARY KEY (id);


--
-- Name: tai_khoan tai_khoan_bac_si_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT tai_khoan_bac_si_id_key UNIQUE (bac_si_id);


--
-- Name: tai_khoan tai_khoan_benh_nhan_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT tai_khoan_benh_nhan_id_key UNIQUE (benh_nhan_id);


--
-- Name: tai_khoan tai_khoan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT tai_khoan_pkey PRIMARY KEY (id);


--
-- Name: tai_khoan tai_khoan_quan_ly_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT tai_khoan_quan_ly_id_key UNIQUE (quan_ly_id);


--
-- Name: tai_khoan tai_khoan_ten_dang_nhap_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT tai_khoan_ten_dang_nhap_key UNIQUE (ten_dang_nhap);


--
-- Name: thanh_toan thanh_toan_ma_giao_dich_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanh_toan
    ADD CONSTRAINT thanh_toan_ma_giao_dich_key UNIQUE (ma_giao_dich);


--
-- Name: thanh_toan thanh_toan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanh_toan
    ADD CONSTRAINT thanh_toan_pkey PRIMARY KEY (id);


--
-- Name: thong_bao thong_bao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thong_bao
    ADD CONSTRAINT thong_bao_pkey PRIMARY KEY (id);


--
-- Name: thuoc thuoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thuoc
    ADD CONSTRAINT thuoc_pkey PRIMARY KEY (id);


--
-- Name: tien_su_benh tien_su_benh_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tien_su_benh
    ADD CONSTRAINT tien_su_benh_pkey PRIMARY KEY (id);


--
-- Name: tiep_nhan_benh_nhan tiep_nhan_benh_nhan_id_lich_hen_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tiep_nhan_benh_nhan
    ADD CONSTRAINT tiep_nhan_benh_nhan_id_lich_hen_key UNIQUE (lich_hen_id);


--
-- Name: tiep_nhan_benh_nhan tiep_nhan_benh_nhan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tiep_nhan_benh_nhan
    ADD CONSTRAINT tiep_nhan_benh_nhan_pkey PRIMARY KEY (id);


--
-- Name: chi_tiet_don_thuoc uq_ctdt_don_thuoc_thuoc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chi_tiet_don_thuoc
    ADD CONSTRAINT uq_ctdt_don_thuoc_thuoc UNIQUE (don_thuoc_id, thuoc_id);


--
-- Name: goi_y_thuoc uq_goi_y_benh_thuoc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goi_y_thuoc
    ADD CONSTRAINT uq_goi_y_benh_thuoc UNIQUE (benh_id, thuoc_id);


--
-- Name: lich_hen uq_lich_hen_id_bs_bn; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_hen
    ADD CONSTRAINT uq_lich_hen_id_bs_bn UNIQUE (id, bac_si_id, benh_nhan_id);


--
-- Name: phieu_kham uq_phieu_kham_id_bn; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT uq_phieu_kham_id_bn UNIQUE (id, benh_nhan_id);


--
-- Name: phieu_kham uq_phieu_kham_id_bn_bs; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT uq_phieu_kham_id_bn_bs UNIQUE (id, benh_nhan_id, bac_si_id);


--
-- Name: idx_bac_si_ho_ten; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bac_si_ho_ten ON public.bac_si USING btree (ho_ten);


--
-- Name: idx_benh_nhan_ho_ten; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_benh_nhan_ho_ten ON public.benh_nhan USING btree (ho_ten);


--
-- Name: idx_chan_doan_phieu; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chan_doan_phieu ON public.chan_doan USING btree (phieu_kham_id);


--
-- Name: idx_don_thuoc_ngay; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_don_thuoc_ngay ON public.don_thuoc USING btree (ngay_ke_don);


--
-- Name: idx_giao_dich_thuoc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_giao_dich_thuoc ON public.giao_dich_kho_thuoc USING btree (thuoc_id, ngay_tao);


--
-- Name: idx_hoa_don_ngay; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hoa_don_ngay ON public.hoa_don USING btree (ngay_lap);


--
-- Name: idx_lich_hen_bac_si; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lich_hen_bac_si ON public.lich_hen USING btree (bac_si_id);


--
-- Name: idx_lich_hen_benh_nhan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lich_hen_benh_nhan ON public.lich_hen USING btree (benh_nhan_id);


--
-- Name: idx_lich_hen_ngay_gio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lich_hen_ngay_gio ON public.lich_hen USING btree (ngay_hen, gio_hen);


--
-- Name: idx_lich_hen_trang_thai; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lich_hen_trang_thai ON public.lich_hen USING btree (trang_thai);


--
-- Name: idx_lich_lam_viec_bs_ngay; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lich_lam_viec_bs_ngay ON public.lich_lam_viec USING btree (bac_si_id, ngay_lam_viec);


--
-- Name: idx_phieu_kham_ngay; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_phieu_kham_ngay ON public.phieu_kham USING btree (ngay_kham);


--
-- Name: idx_thanh_toan_hoa_don; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_thanh_toan_hoa_don ON public.thanh_toan USING btree (hoa_don_id);


--
-- Name: idx_thong_bao_lich_hen; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_thong_bao_lich_hen ON public.thong_bao USING btree (lich_hen_id);


--
-- Name: idx_thong_bao_tai_khoan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_thong_bao_tai_khoan ON public.thong_bao USING btree (tai_khoan_id);


--
-- Name: idx_thuoc_ten_thuoc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_thuoc_ten_thuoc ON public.thuoc USING btree (ten_thuoc);


--
-- Name: uq_bac_si_chuyen_khoa_chinh; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_bac_si_chuyen_khoa_chinh ON public.bac_si_chuyen_khoa USING btree (bac_si_id) WHERE (la_chuyen_khoa_chinh = true);


--
-- Name: uq_chan_doan_chinh; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_chan_doan_chinh ON public.chan_doan USING btree (phieu_kham_id) WHERE (la_chan_doan_chinh = true);


--
-- Name: uq_giao_dich_xuat_don_thuoc; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_giao_dich_xuat_don_thuoc ON public.giao_dich_kho_thuoc USING btree (tham_chieu_id, thuoc_id) WHERE ((loai_giao_dich)::text = 'XUAT_DON_THUOC'::text);


--
-- Name: uq_lich_hen_bac_si_khung_gio; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_lich_hen_bac_si_khung_gio ON public.lich_hen USING btree (bac_si_id, ngay_hen, gio_hen) WHERE ((trang_thai)::text <> 'Huy'::text);


--
-- Name: bac_si trg_bac_si_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_bac_si_ngay_cap_nhat BEFORE UPDATE ON public.bac_si FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: benh_nhan trg_benh_nhan_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_benh_nhan_ngay_cap_nhat BEFORE UPDATE ON public.benh_nhan FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: chuyen_khoa trg_chuyen_khoa_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_chuyen_khoa_ngay_cap_nhat BEFORE UPDATE ON public.chuyen_khoa FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: danh_muc_ten_benh trg_danh_muc_ten_benh_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_danh_muc_ten_benh_ngay_cap_nhat BEFORE UPDATE ON public.danh_muc_ten_benh FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: don_thuoc trg_don_thuoc_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_don_thuoc_ngay_cap_nhat BEFORE UPDATE ON public.don_thuoc FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: goi_y_thuoc trg_goi_y_thuoc_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_goi_y_thuoc_ngay_cap_nhat BEFORE UPDATE ON public.goi_y_thuoc FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: hoa_don trg_hoa_don_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hoa_don_ngay_cap_nhat BEFORE UPDATE ON public.hoa_don FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: lich_hen trg_lich_hen_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_lich_hen_ngay_cap_nhat BEFORE UPDATE ON public.lich_hen FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: lich_lam_viec trg_lich_lam_viec_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_lich_lam_viec_ngay_cap_nhat BEFORE UPDATE ON public.lich_lam_viec FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: phieu_kham trg_phieu_kham_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_phieu_kham_ngay_cap_nhat BEFORE UPDATE ON public.phieu_kham FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: tai_khoan trg_tai_khoan_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_tai_khoan_ngay_cap_nhat BEFORE UPDATE ON public.tai_khoan FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: thuoc trg_thuoc_ngay_cap_nhat; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_thuoc_ngay_cap_nhat BEFORE UPDATE ON public.thuoc FOR EACH ROW EXECUTE FUNCTION public.fn_set_ngay_cap_nhat();


--
-- Name: bac_si fk_bac_si_tai_khoan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si
    ADD CONSTRAINT fk_bac_si_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: benh_nhan fk_benh_nhan_tai_khoan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.benh_nhan
    ADD CONSTRAINT fk_benh_nhan_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bac_si_chuyen_khoa fk_bsck_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si_chuyen_khoa
    ADD CONSTRAINT fk_bsck_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bac_si_chuyen_khoa fk_bsck_chuyen_khoa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bac_si_chuyen_khoa
    ADD CONSTRAINT fk_bsck_chuyen_khoa FOREIGN KEY (chuyen_khoa_id) REFERENCES public.chuyen_khoa(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chan_doan fk_chan_doan_danh_muc_benh; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chan_doan
    ADD CONSTRAINT fk_chan_doan_danh_muc_benh FOREIGN KEY (benh_id) REFERENCES public.danh_muc_ten_benh(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chan_doan fk_chan_doan_phieu_kham; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chan_doan
    ADD CONSTRAINT fk_chan_doan_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES public.phieu_kham(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chi_tiet_don_thuoc fk_ctdt_don_thuoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chi_tiet_don_thuoc
    ADD CONSTRAINT fk_ctdt_don_thuoc FOREIGN KEY (don_thuoc_id) REFERENCES public.don_thuoc(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chi_tiet_don_thuoc fk_ctdt_thuoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chi_tiet_don_thuoc
    ADD CONSTRAINT fk_ctdt_thuoc FOREIGN KEY (thuoc_id) REFERENCES public.thuoc(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: don_thuoc fk_don_thuoc_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT fk_don_thuoc_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: don_thuoc fk_don_thuoc_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT fk_don_thuoc_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: don_thuoc fk_don_thuoc_phieu_kham; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT fk_don_thuoc_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES public.phieu_kham(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: don_thuoc fk_don_thuoc_phieu_kham_snapshot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.don_thuoc
    ADD CONSTRAINT fk_don_thuoc_phieu_kham_snapshot FOREIGN KEY (phieu_kham_id, benh_nhan_id, bac_si_id) REFERENCES public.phieu_kham(id, benh_nhan_id, bac_si_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: giao_dich_kho_thuoc fk_giao_dich_kho_thuoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giao_dich_kho_thuoc
    ADD CONSTRAINT fk_giao_dich_kho_thuoc FOREIGN KEY (thuoc_id) REFERENCES public.thuoc(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: giao_dich_kho_thuoc fk_giao_dich_tham_chieu_don_thuoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giao_dich_kho_thuoc
    ADD CONSTRAINT fk_giao_dich_tham_chieu_don_thuoc FOREIGN KEY (tham_chieu_id) REFERENCES public.don_thuoc(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: giao_dich_kho_thuoc fk_giao_dich_xuat_don_thuoc_chi_tiet; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giao_dich_kho_thuoc
    ADD CONSTRAINT fk_giao_dich_xuat_don_thuoc_chi_tiet FOREIGN KEY (tham_chieu_id, thuoc_id) REFERENCES public.chi_tiet_don_thuoc(don_thuoc_id, thuoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: goi_y_thuoc fk_goi_y_thuoc_benh; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goi_y_thuoc
    ADD CONSTRAINT fk_goi_y_thuoc_benh FOREIGN KEY (benh_id) REFERENCES public.danh_muc_ten_benh(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: goi_y_thuoc fk_goi_y_thuoc_thuoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goi_y_thuoc
    ADD CONSTRAINT fk_goi_y_thuoc_thuoc FOREIGN KEY (thuoc_id) REFERENCES public.thuoc(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hoa_don fk_hoa_don_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoa_don
    ADD CONSTRAINT fk_hoa_don_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hoa_don fk_hoa_don_phieu_kham; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoa_don
    ADD CONSTRAINT fk_hoa_don_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES public.phieu_kham(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hoa_don fk_hoa_don_phieu_kham_snapshot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoa_don
    ADD CONSTRAINT fk_hoa_don_phieu_kham_snapshot FOREIGN KEY (phieu_kham_id, benh_nhan_id) REFERENCES public.phieu_kham(id, benh_nhan_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lich_hen fk_lich_hen_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_hen
    ADD CONSTRAINT fk_lich_hen_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lich_hen fk_lich_hen_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_hen
    ADD CONSTRAINT fk_lich_hen_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lich_lam_viec fk_lich_lam_viec_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_lam_viec
    ADD CONSTRAINT fk_lich_lam_viec_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lich_su_lich_hen fk_lich_su_lich_hen; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_su_lich_hen
    ADD CONSTRAINT fk_lich_su_lich_hen FOREIGN KEY (lich_hen_id) REFERENCES public.lich_hen(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lich_su_lich_hen fk_lich_su_nguoi_thay_doi; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lich_su_lich_hen
    ADD CONSTRAINT fk_lich_su_nguoi_thay_doi FOREIGN KEY (nguoi_thay_doi) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nhat_ky_hoat_dong fk_nhat_ky_tai_khoan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nhat_ky_hoat_dong
    ADD CONSTRAINT fk_nhat_ky_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: phieu_kham fk_phieu_kham_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT fk_phieu_kham_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: phieu_kham fk_phieu_kham_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT fk_phieu_kham_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: phieu_kham fk_phieu_kham_lich_hen; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT fk_phieu_kham_lich_hen FOREIGN KEY (lich_hen_id) REFERENCES public.lich_hen(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: phieu_kham fk_phieu_kham_lich_hen_snapshot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phieu_kham
    ADD CONSTRAINT fk_phieu_kham_lich_hen_snapshot FOREIGN KEY (lich_hen_id, bac_si_id, benh_nhan_id) REFERENCES public.lich_hen(id, bac_si_id, benh_nhan_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: quan_ly fk_quan_ly_tai_khoan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quan_ly
    ADD CONSTRAINT fk_quan_ly_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tai_khoan fk_tai_khoan_bac_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT fk_tai_khoan_bac_si FOREIGN KEY (bac_si_id) REFERENCES public.bac_si(id) ON DELETE SET NULL;


--
-- Name: tai_khoan fk_tai_khoan_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT fk_tai_khoan_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON DELETE SET NULL;


--
-- Name: tai_khoan fk_tai_khoan_quan_ly; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tai_khoan
    ADD CONSTRAINT fk_tai_khoan_quan_ly FOREIGN KEY (quan_ly_id) REFERENCES public.quan_ly(id) ON DELETE SET NULL;


--
-- Name: thanh_toan fk_thanh_toan_hoa_don; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanh_toan
    ADD CONSTRAINT fk_thanh_toan_hoa_don FOREIGN KEY (hoa_don_id) REFERENCES public.hoa_don(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: thong_bao fk_thong_bao_lich_hen; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thong_bao
    ADD CONSTRAINT fk_thong_bao_lich_hen FOREIGN KEY (lich_hen_id) REFERENCES public.lich_hen(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: thong_bao fk_thong_bao_tai_khoan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thong_bao
    ADD CONSTRAINT fk_thong_bao_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES public.tai_khoan(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tien_su_benh fk_tien_su_benh_benh_nhan; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tien_su_benh
    ADD CONSTRAINT fk_tien_su_benh_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES public.benh_nhan(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tiep_nhan_benh_nhan fk_tiep_nhan_lich_hen; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tiep_nhan_benh_nhan
    ADD CONSTRAINT fk_tiep_nhan_lich_hen FOREIGN KEY (lich_hen_id) REFERENCES public.lich_hen(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict n1KzGdG9bPBw8QtiBTqaIoeuxB9Rs5Pf4UzNtpdds9H20OGPU6jIAAd5XsJ8p4L

