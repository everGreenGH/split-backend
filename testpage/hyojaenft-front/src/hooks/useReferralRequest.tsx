import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseReferralRequestProps {
  userAddress: string;
  referralProviderAddress: string | null;
}

interface UseReferralRequestResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

const useReferralRequest = ({ userAddress, referralProviderAddress }: UseReferralRequestProps): UseReferralRequestResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sendPostRequest = async () => {
      try {
        setLoading(true);
        console.log(userAddress, referralProviderAddress);

        const response = await axios.post('http://localhost:8000/referral', {
          userAddress,
          referralProviderAddress,
        }, {
                headers: {
                  'api-key': "c92f5b322d6d76d4981df4ce164e2151",
                },
        });
        console.log('/referral', response);

        if (response.status === 200) {
          setSuccess(true);
        } else {
          setSuccess(false);
          setError(new Error(`Referral request failed with status: ${response.status}`));
        }
      } catch (error) {
        console.log('/referra error', error);
        setSuccess(false);
        // setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (referralProviderAddress) {
      sendPostRequest();
    }
  }, [userAddress, referralProviderAddress]);

  return { loading, error, success };
};

export default useReferralRequest;
