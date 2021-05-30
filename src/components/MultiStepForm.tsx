import React, { useState } from 'react';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import { Card, CardContent, Button, Box, Stepper, Step, StepLabel, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';





export interface FormFiled {
  Fname: string,
  Lname: string,
  age: number,
  email: string,
  Phno: number,
  city: string,
  details: string
}

const initialValues: FormFiled = {
  Fname: "",
  Lname: "",
  age: 0,
  email: "",
  Phno: 0,
  city: "",
  details: ""
}

const validationSchema1 = Yup.object({
  Fname: Yup.string()
    .required('Required')
    .max(15, "Must be 15 character or less"),
  Lname: Yup.string()
    .required('Required')
    .max(15, "Must be 15 character or less"),
  age: Yup.number()
    .required("Required")
    .min(18, "age must be 18 or above 18")
    .max(30, "age must be 30 or below 30")
})

const validationSchema2 = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required('Required'),
  Phno: Yup.number()
    .required('Required'),
  city: Yup.string()
    .required('Required'),
})


const validationSchema3 = Yup.object({
  details: Yup.string()
    .required('Required')
    .max(60, "must be 60 character or less")
})

export default function MultiStepForm() {
  return (
    <Card>
      <CardContent>
        <FormikStepper initialValues={initialValues} onSubmit={(values,{setSubmitting})=>{
                    setTimeout(() => {
                        alert(JSON.stringify(values,null,2));
                        setSubmitting(false);
                    }, 1000);
                }}>
          <FormikStep validationSchema={validationSchema1}>
            <Box paddingBottom={2}>
              <Field fullWidth name="Fname" type="text" component={TextField} label="First Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="Lname" type="text" component={TextField} label="Last Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="age" type="number" component={TextField} label="Age" />
            </Box>
          </FormikStep>
          <FormikStep validationSchema={validationSchema2}>
            <Box paddingBottom={2}>
              <Field fullWidth name="email" type="text" component={TextField} label="Email" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="Phno" type="number" component={TextField} label="Number" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="city" type="text" component={TextField} label="City" />
            </Box>
          </FormikStep>
          <FormikStep validationSchema={validationSchema3}>
            <Box paddingBottom={2}>
              <Field fullWidth name="details" type="text" component={TextField} label="Qualification Details" />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  )
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {

}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children} </>
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  // const childrenArray = React.Children.toArray(children)as React.ElementType<FormikStepProps>[];
  const [step, setstep] = useState(0)
  const [completed, setcompleted] = useState(false)
  const currentChild = childrenArray[step] as React.ElementType<FormikStepProps>;
  function isLastStep() {
    return step === childrenArray.length - 1;
  }


  const QontoConnector = withStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    active: {
      '& $line': {
        borderColor: '#784af4',
      },
    },
    completed: {
      '& $line': {
        borderColor: '#784af4',
      },
    },
    line: {
      borderColor: '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);


  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setcompleted(true)
        }
        else {
          setstep((s) => s + 1)
        }
      }} >
      <Form>
      <Stepper connector={<QontoConnector />} alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        {currentChild}
        {step > 0 ? <Button variant="contained" color="primary" onClick={() => setstep((s) => s - 1)} >Back</Button> : null}
        <Button variant="contained" color="primary" type="submit">{isLastStep() ? 'Submit' : 'Next'}</Button>
      </Form>
    </Formik>
  );
}