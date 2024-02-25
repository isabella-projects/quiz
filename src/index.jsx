import './index.scss';
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon } from '@wordpress/components';

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
        <div className="quiz-edit-block">
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
