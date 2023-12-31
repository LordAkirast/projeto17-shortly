--
-- PostgreSQL database dump
--

-- Dumped from database version 12.15 (Ubuntu 12.15-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.15 (Ubuntu 12.15-0ubuntu0.20.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    url text NOT NULL,
    createdat timestamp without time zone DEFAULT now(),
    "shortUrl" text,
    visitcount integer DEFAULT 0,
    creator text
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    createdat timestamp without time zone,
    visitcount integer,
    token text,
    linkscount integer DEFAULT 0
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (2, 'Lorena39@hotmail.com-PA4S6dE', '2023-08-05 17:15:22.376175', NULL, 0, NULL);
INSERT INTO public.urls VALUES (3, 'Lorena39@hotmail.comGMVMHOo4', '2023-08-05 17:15:22.376175', NULL, 0, NULL);
INSERT INTO public.urls VALUES (4, 'Lorena39@hotmail.comM47KMUmv', '2023-08-05 17:15:22.376175', NULL, 0, NULL);
INSERT INTO public.urls VALUES (5, 'https:/Lorena39@hotmail.comPrRrWyOS', '2023-08-05 17:15:22.376175', NULL, 0, NULL);
INSERT INTO public.urls VALUES (6, 'https:/Lorena39@hotmail.com', '2023-08-06 03:03:21', NULL, 0, NULL);
INSERT INTO public.urls VALUES (8, 'https:/Lorena39@hotmail.com', '2023-08-06 03:07:34', 'pv8G0vzQ', 0, NULL);
INSERT INTO public.urls VALUES (9, 'https:/Lorena39@hotmail.com', '2023-08-06 13:43:47', 'lvdPzCsh', 0, NULL);
INSERT INTO public.urls VALUES (10, 'https:/Lorena39@hotmail.com', '2023-08-06 14:02:54', 'mtwWrmSF', 0, NULL);
INSERT INTO public.urls VALUES (11, 'https:/Lorena39@hotmail.com', '2023-08-06 14:07:15', 'EfEjgvXu', 0, NULL);
INSERT INTO public.urls VALUES (7, 'https:/Lorena39@hotmail.com', '2023-08-06 03:06:42', 'puVdmqJD', 11, NULL);
INSERT INTO public.urls VALUES (1, 'Lorena39@hotmail.comiSgSfCwC', '2023-08-05 17:15:22.376175', NULL, 8, 'Lorena37@hotmail.com');
INSERT INTO public.urls VALUES (12, 'https://...', '2023-08-07 03:51:55', 'xto0p45s', 0, 'joao@driven.com.br');
INSERT INTO public.urls VALUES (13, 'https://...', '2023-08-07 03:51:55', 'VBs_qev9', 0, 'joao@driven.com.br');
INSERT INTO public.urls VALUES (14, 'https://...', '2023-08-07 03:54:24', 'CB8b8_oE', 0, 'joao@driven.com.br');
INSERT INTO public.urls VALUES (15, 'https://...', '2023-08-07 03:55:37', 'CVLrV062', 0, 'joao@driven.com.br');
INSERT INTO public.urls VALUES (16, 'https://...', '2023-08-07 03:55:37', 'C-twQ7Jh', 0, 'joao@driven.com.br');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'Isabel Oliveira', 'Lorena37@hotmail.com', '$2b$10$IF7kKMRtzAGW7wD5g3AhOu17jAEar0zbh4heFpiyPzDk.SedQ/8Zq', '2023-08-04 04:21:06', NULL, NULL, 0);
INSERT INTO public.users VALUES (2, 'Isabel Oliveira', 'Lorena39@hotmail.com', '$2b$10$AHz3Y7SMl/OzxfKEmDEb.uMuqw75K1Lym8.U.HkQ/jIGoLgOoXtgi', '2023-08-04 04:21:18', NULL, NULL, 0);
INSERT INTO public.users VALUES (3, 'teste linkcount', 'joao@driven.com.br', '$2b$10$qtN9lbqaa.GkD1nz9Gpg3.mycIo.TYvGvJKI/0k2FVT9zzjN7waeW', '2023-08-07 03:51:55', NULL, 'fa7beaa8-d399-4812-bc88-a5b5d782a093', 2);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 16, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

