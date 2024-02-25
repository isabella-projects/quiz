import './index.scss';
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon } from '@wordpress/components';

wp.blocks.registerBlockType('multiple-choice/quiz', {
    title: 'Quiz',
    icon: 'smiley',
    category: 'common',
    attributes: {
        question: { type: 'string' },
        answers: { type: 'array', default: ['red', 'blue'] },
    },
    edit: EditComponent,
    save: function (props) {
        return null;
    },
});

function EditComponent(props) {
    function updateQuestion(value) {
        props.setAttributes({ question: value });
    }

    function deleteAnswers(id) {
        const newAnswers = props.attributes.answers.filter((arr, index) => index != id);
        props.setAttributes({ answers: newAnswers });
    }

    return (
        <div className="quiz-edit-block">
            <TextControl label="Question:" value={props.attributes.question} onChange={updateQuestion} style={{ fontSize: '20px' }} />
            <p style={{ fontSize: '13px', margin: '20px 0 8px 0' }}>Answers:</p>
            {props.attributes.answers.map((answer, index) => {
                return (
                    <Flex>
                        <FlexBlock>
                            <TextControl
                                value={answer}
                                onChange={(newValue) => {
                                    const newAnswers = props.attributes.answers.concat([]);
                                    newAnswers[index] = newValue;
                                    props.setAttributes({ answers: newAnswers });
                                }}
                                autoFocus={answer == undefined}
                            />
                        </FlexBlock>
                        <FlexItem>
                            <Button>
                                <Icon className="mark-as-correct" icon="star-empty" />
                            </Button>
                        </FlexItem>
                        <FlexItem>
                            <Button variant="link" className="attention-delete" onClick={() => deleteAnswers(index)}>
                                Delete
                            </Button>
                        </FlexItem>
                    </Flex>
                );
            })}

            <Button
                variant="primary"
                onClick={() => {
                    props.setAttributes({ answers: props.attributes.answers.concat([undefined]) });
                }}
            >
                Add another answer
            </Button>
        </div>
    );
}
