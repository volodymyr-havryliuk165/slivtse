import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { Input } from '@/components/Input';
import Link from 'next/link';
import Head from 'next/head';

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Ім'я користувача обов'язкове"),
  password: Yup.string().required("Пароль обов'язковий"),
});

const opts = { resolver: yupResolver(validationSchema) };

export default function Login({ pb }) {
  const router = useRouter();
  const { register, handleSubmit, setError, formState } = useForm(opts);
  const { errors } = formState;

  useEffect(() => {
    if (pb?.authStore.isValid) router.push('/');
  }, [pb, router]);

async function onSubmit({ username, password }) {
  try {
    const authData = await pb
      .collection('users')
      .authWithPassword(username, password);
    if (authData) {
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

      router.push('/');
    }
  } catch (e) {
    alert('Неправильний логін чи пароль')
  }
}
  return (
    <div className='bg-slate-200 min-h-screen flex items-center justify-center'>
      <Head>
        <title>Логін</title>
        <meta property='og:title' content="Логін" key='title' />
      </Head>
      <Link href='/'>
        <button
          className={`px-14 py-4 text-lg rounded-lg fixed top-8 left-8 bg-blue-500`}
        >
          Назад
        </button>
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 border-2 border-slate-800 px-40 py-32 h-1/2 rounded-2xl bg-slate-400 shadow-[10px_10px_0_rgba(0,0,0,1)]'
      >
        <Input
          name='username'
          type='text'
          label="Ім'я користувача"
          {...register('username')}
          error={errors.username?.message}
        />
        <Input
          name='password'
          type='password'
          label='Пароль'
          {...register('password')}
          error={errors.password?.message}
        />
        <input
          type='submit'
          className='bg-green-300 cursor-pointer mt-auto p-4 text-3xl rounded'
          value='Увійти'
        />
        <Link href='/register'>Не маєте акаунта? Зареєструватись</Link>
      </form>
    </div>
  );
}
