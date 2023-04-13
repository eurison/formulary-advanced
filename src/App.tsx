import { useState } from 'react'
import './styles/global.css'

/**
 *
 * @To-do
 *
 * [x] Validação / transformação
 * [x] Field array
 * [ ] Uploand de arquivos
 * [ ] composition Pattern
 *
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
// {z} para validar e transforma valores e resultados

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('o nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O email é obrigatório')
    .email('Formato de email invalido')
    .toLowerCase(),
  password: z.string().min(6, 'A senha deve conter no minimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('a tec. é obrigatório'),
        knowledge: z.coerce.number().max(100),
      }),
    )
    .min(2, 'deve conter pelo menos duas tecs'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('') // estado para mostra em tela

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2)) // para mostrar o resultado em tela
  }

  return (
    <main className="h-screen bg-zinc-900 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="">
            Nome
          </label>
          <input
            type="text"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-700 text-white"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="">
            E-mail
          </label>
          <input
            type="email"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-700 text-white"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="">
            Senha
          </label>
          <input
            type="password"
            // name="password"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-700 text-white"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adcionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-zinc-800 shadow-sm rounded h-10 px-x bg-zinc-700 text-white"
                    {...register(`techs.${index}.title`)}
                  />
                  {/* {errors.techs?.[index]?.title && (
                    <span>{errors.techs?.[index]?.title?.message}</span>
                  )} */}
                  <input
                    type="number"
                    className="w-16 flex-1 border border-zinc-800 shadow-sm rounded h-10 px-x bg-zinc-700 text-white"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {/* {errors.techs?.[index]?.knowledge && (
                    <span>{errors.techs?.[index]?.knowledge?.message}</span>
                  )} */}
                </div>
                {errors.techs && (
                  <span className="text-red-500 text-sm">
                    {errors.techs.message}
                  </span>
                )}
              </div>
            )
          })}
        </div>

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
