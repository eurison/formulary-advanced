import { useState } from 'react';
import './styles/global.css';

/**
 * 
 * @To-do
 * 
 * [ ] Validação / transformação
 * [ ] Fiesl array
 * [ ] Uploand de arquivos
 * [ ] composition Pattern
 * 
*/

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const createUserFormSchema = z.object({
  email: z.string()
    .nonempty('O email é obrigatório')
    .email('Formato de email invalido'),
  password: z.string()
    .min(6, 'A senha deve conter no minimo 6 caracteres')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const[output, setOutput] = useState('')

  const {
    register, 
    handleSubmit, 
    formState: {errors}
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })
  

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
  }



  return (
    <main className="h-screen bg-zinc-900 text-zinc-300 flex flex-col gap-10 items-center justify-center">
     <form 
      onSubmit={handleSubmit(createUser)}
      className="flex flex-col gap-4 w-full max-w-xs"
      > 
      <div className='flex flex-col gap-2' >
        <label htmlFor="" className=''>E-mail</label>
        <input 
          type="email" 
          className='border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-700 text-white'
          {...register('email')}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="" className=''>Senha</label>
        <input 
          type="password" 
          // name="password"
          className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-700 text-white"
          {...register('password')}
         />
      </div>
      {errors.password && <span>{errors.password.message}</span>}

      <button 
        type="submit"
        className="bg-emerald-500 rounded font-semibold h-10 hover:bg-emerald-800 text-white "
      >
        salvar
      </button>
        <pre>{output}</pre>
     </form>
   </main>
  )
}
