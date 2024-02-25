import './index.scss';
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from '@wordpress/components';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

(function () {
    let locked = false;

    wp.data.subscribe(function () {
        const results = wp.data
            .select('core/block-editor')
            .getBlocks()
            .filter((block) => block.name == 'multiple-choice/quiz' && block.attributes.correctAnswer == undefined);

        if (results.length && locked == false) {
            locked = true;
            wp.data.dispatch('core/editor').lockPostSaving('no-answer');
        }

        if (!results.length && locked) {
            locked = false;
            wp.data.dispatch('core/editor').unlockPostSaving('no-answer');
        }
    });
})();

wp.blocks.registerBlockType('multiple-choice/quiz', {
    title: 'Quiz',
    icon: 'smiley',
    category: 'common',
    attributes: {
        question: { type: 'string' },
        answers: { type: 'array', default: [''] },
        correctAnswer: { type: 'number', default: undefined },
        bgColor: { type: 'string', default: '#EBEBEB' },
        theAlignment: { type: 'string', default: 'left' },
    },
    description: 'Give your audience a chance to prove their comprehension.',
    example: {
        attributes: {
            question: 'When was John Lennon born?',
            correctAnswer: 3,
            answers: ['1937', '1935', '1940', '1943'],
            theAlignment: 'center',
            bgColor: '#CFE8F1',
        },
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

        if (id == props.attributes.correctAnswer) {
            props.setAttributes({ correctAnswer: undefined });
        }
    }

    function markAsCorrect(id) {
        props.setAttributes({ correctAnswer: id });
    }

    return (
        <div className="quiz-edit-block" style={{ backgroundColor: props.attributes.bgColor }}>
            <BlockControls>
                <AlignmentToolbar value={props.attributes.theAlignment} onChange={(alignType) => props.setAttributes({ theAlignment: alignType })} />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Background Color" initialOpen={true}>
                    <ColorPicker
                        color={props.attributes.bgColor}
                        onChangeComplete={(pickerType) => props.setAttributes({ bgColor: pickerType.hex })}
                    />
                </PanelBody>
            </InspectorControls>
            <TextControl
                label="Question:"
                value={props.attributes.question}
                onChange={updateQuestion}
                style={{ fontSize: '20px' }}
                placeholder="Example: What year was John Lennon born?"
            />
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
                                placeholder="Example answer: 1940"
                            />
                        </FlexBlock>
                        <FlexItem>
                            <Button onClick={() => markAsCorrect(index)}>
                                <Icon className="mark-as-correct" icon={props.attributes.correctAnswer == index ? 'star-filled' : 'star-empty'} />
                            </Button>
                        </FlexItem>
                        <FlexItem>
                            <Button variant="link" className="attention-delete" onClick={() => deleteAnswers(index)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-trash"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
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
