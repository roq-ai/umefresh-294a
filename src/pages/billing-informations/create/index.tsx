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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { billingInformationValidationSchema } from 'validationSchema/billing-informations';
import { UserInterface } from 'interfaces/user';
import { BillingInformationInterface } from 'interfaces/billing-information';

function BillingInformationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: BillingInformationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.billing_information.create({ data: values as RoqTypes.billing_information });
      resetForm();
      router.push('/billing-informations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BillingInformationInterface>({
    initialValues: {
      card_number: '',
      card_name: '',
      expiration_date: new Date(new Date().toDateString()),
      cvv: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
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
              label: 'Create Billing Information',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Billing Information
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
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
    operation: AccessOperationEnum.CREATE,
  }),
)(BillingInformationCreatePage);
