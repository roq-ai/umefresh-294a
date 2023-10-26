import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { useRoqClient, useBillingInformationFindFirst } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';
import { convertQueryToPrismaUtil } from 'lib/utils';
import { billingInformationValidationSchema } from 'validationSchema/billing-informations';
import { BillingInformationInterface } from 'interfaces/billing-information';
import { UserInterface } from 'interfaces/user';

function BillingInformationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const roqClient = useRoqClient();
  const queryParams = useMemo(
    () =>
      convertQueryToPrismaUtil(
        {
          id,
        },
        'billing_information',
      ),
    [id],
  );
  const { data, error, isLoading, mutate } = useBillingInformationFindFirst(queryParams, {}, { disabled: !id });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BillingInformationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await roqClient.billing_information.update({
        data: values as RoqTypes.billing_information,
        where: {
          id,
        },
      });
      mutate(updated);
      resetForm();
      router.push('/billing-informations');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<BillingInformationInterface>({
    initialValues: data,
    validationSchema: billingInformationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Billing Informations',
              link: '/billing-informations',
            },
            {
              label: 'Update Billing Information',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Billing Information
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.card_number}
            label={'Card Number'}
            props={{
              name: 'card_number',
              placeholder: 'Card Number',
              value: formik.values?.card_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.card_name}
            label={'Card Name'}
            props={{
              name: 'card_name',
              placeholder: 'Card Name',
              value: formik.values?.card_name,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="expiration_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Expiration Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.expiration_date ? new Date(formik.values?.expiration_date) : null}
              onChange={(value: Date) => formik.setFieldValue('expiration_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Cvv"
            formControlProps={{
              id: 'cvv',
              isInvalid: !!formik.errors?.cvv,
            }}
            name="cvv"
            error={formik.errors?.cvv}
            value={formik.values?.cvv}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('cvv', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={() => roqClient.user.findManyWithCount({})}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/billing-informations')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'billing_information',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BillingInformationEditPage);
