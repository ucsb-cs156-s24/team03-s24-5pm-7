import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    const testIdPrefix = "MenuItemReviewForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="itemId">Item ID</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-itemId"}
                            id="itemId"
                            type="text"
                            isInvalid={Boolean(errors.itemId)}
                            {...register("itemId", {
                                required: "Item ID is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.itemId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-reviewerEmail"}
                            id="reviewerEmail"
                            type="text"
                            isInvalid={Boolean(errors.reviewerEmail)}
                            {...register("reviewerEmail", {
                                required: "Reviewer Email is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-stars"}
                            id="stars"
                            type="text"
                            isInvalid={Boolean(errors.stars)}
                            {...register("stars", {
                                required: "Star rating is required.",
                                max: {
                                    value : 5,
                                    message : "Maximum rating is 5 stars."
                                },
                                min: {
                                    value : 0,
                                    message : "Minimum rating is 0 stars."
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stars?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>

                <Col>
            
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed (iso format)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateReviewed"}
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'Date Reviewed is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>
            </Row>

            <Row>

                <Col>

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-comments"}
                            id="comments"
                            type="text"
                            isInvalid={Boolean(errors.comments)}
                            {...register("comments", {
                                required: "Comment is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.comments?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>

            </Row>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MenuItemReviewForm;