import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

import axios from '~/shared/lib/axios'
import { Roles } from '~/shared/data/roleConstant'
import { catchError } from '~/utils/handleAxiosError'
import { AxiosResponseError, User } from '~/shared/types'

const useAuth = () => {
  const [isError, setIsError] = useState<boolean>(false)
  const router = useRouter()
  const [error, setError] = useState<AxiosResponseError>({
    status: 0,
    content: null
  })

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const register = async (data: User) => {
    try {
      setIsError(false)
      await csrf()
      const response = await axios.post('register', data)
      if (response.status === 204) {
        toast.error('Account currently not yet verified please wait to the admin for approval.', {
          position: 'top-right'
        })
        deleteCookie('XSRF-TOKEN')
        window.location.href = 'login'
        return
      }
    } catch (err: any) {
      setIsError(true)
      setError(catchError(err))
    }
  }

  const login = async (data: User) => {
    try {
      setIsError(false)
      await csrf()
      const response = await axios.post('login', data)

      if (response.statusText === 'OK') {
        if (response?.data?.role === Roles.ADMIN) {
          toast.success('You have successfully logged in!', { position: 'top-right' })
          router.push('/admin/dashboard')
          return
        }

        if (!response?.data?.is_verified) {
          toast.error('Account currently not yet verified', { position: 'top-right' })
          deleteCookie('XSRF-TOKEN')
        } else {
          window.location.href = '/'
        }
      }
    } catch (err: any) {
      setIsError(true)
      setError(catchError(err))
    }
  }

  return {
    isError,
    register,
    login,
    error
  }
}

export default useAuth
