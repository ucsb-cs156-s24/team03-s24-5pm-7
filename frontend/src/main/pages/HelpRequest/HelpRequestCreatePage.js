import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequest/post",
    method: "POST",
    params: {
      requesterEmail: helpRequest.requesterEmail,
      teamID: helpRequest.teamID,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      requestTime: helpRequest.requestTime,
      explanation: helpRequest.explanation,
      solved: helpRequest.solved,
    }
  });

  const onSuccess = (helpRequest) => {
    toast(`New helpRequest Created - id: ${helpRequest.id} teamID: ${helpRequest.teamID}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequest/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />
  }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New HelpRequest</h1>

        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}