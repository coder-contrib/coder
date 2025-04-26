import { API } from "api/api";
import { useTemplateLayoutContext } from "pages/TemplatePage/TemplateLayout";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { getTemplatePageTitle } from "../utils";
import { TemplateResourcesPageView } from "./TemplateResourcesPageView";

export const TemplateResourcesPage: FC = () => {
	const { template, activeVersion } = useTemplateLayoutContext();
	const { data: resources } = useQuery({
		queryKey: ["templates", template.id, "resources"],
		queryFn: () => API.getTemplateVersionResources(activeVersion.id),
	});

	return (
		<>
			<Helmet>
				<title>{getTemplatePageTitle("Resources", template)}</title>
			</Helmet>
			<TemplateResourcesPageView
				resources={resources}
				template={template}
				activeVersion={activeVersion}
			/>
		</>
	);
};

export default TemplateResourcesPage;