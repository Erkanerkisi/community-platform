import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { IPostFormInput } from 'src/models/discussions.models'
import { POST_TEMPLATE_DATA } from './PostTemplate'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField } from 'src/components/Form/Fields'
import { Editor, VARIANT } from 'src/components/Editor/'
import { Button } from 'src/components/Button/'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { inject } from 'mobx-react'
import { IStores } from 'src/stores'

interface IState {
  formValues: IPostFormInput
  formSaved: boolean
}

interface IProps extends RouteComponentProps {
  discussionsStore: DiscussionsStore
}

const required = (value: any) => (value ? undefined : 'Required')

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
export class PostCreate extends React.PureComponent<IProps, IState> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    this.state = {
      formValues: { ...POST_TEMPLATE_DATA },
      formSaved: false,
    }
  }

  public onSubmit = async (formValues: IPostFormInput) => {
    try {
      const post = await this.props.discussionsStore.saveDiscussion(formValues)
      this.props.history.push('/discussions/' + post.slug)
    } catch (error) {
      console.log('err', error)
      throw new Error(JSON.stringify(error))
    }
  }

  public EditorField: React.ComponentType<FieldRenderProps> = ({
    input,
    meta,
    ...rest
  }) => (
    <Editor
      content={input.value}
      variant={VARIANT.SMALL}
      onChange={content => {
        input.onChange(content)
      }}
      {...rest}
    />
  )

  public render() {
    const { formValues } = this.state
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Create a Post</h2>
        <Form
          onSubmit={values => this.onSubmit(values as IPostFormInput)}
          initialValues={formValues}
          mutators={{
            ...arrayMutators,
          }}
          render={({ handleSubmit, submitting, invalid }) => {
            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <Field
                    name="title"
                    validate={required}
                    component={InputField}
                    label="What is the title of your post ?"
                    placeholder="Post title"
                  />
                  <Field
                    name="content"
                    component={this.EditorField}
                    validate={required}
                    label="What would you like to discuss?"
                  />
                  <Button
                    type="submit"
                    icon={'check'}
                    disabled={submitting || invalid}
                  >
                    Save
                  </Button>
                </form>
              </div>
            )
          }}
        />
      </div>
    )
  }
}