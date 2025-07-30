import { Callout, Card, Dialog, Spinner, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';

export interface TournamentMini {
	tournament_date: string;
	tournament_name: string;
}

interface SingleTournamentCardProps {
	name: string;
}
const SingleTournamentCard: React.FC<SingleTournamentCardProps> = ({ name }) => {
	const { isPending, error, data } = useQuery({
		queryKey: [name],
		queryFn: () => fetch(`http://localhost:3004/api/tournament/${name}`).then((res) => res.json()),
	});

	console.log(data);

	if (isPending)
		return (
			<div className="flex justify-center">
				<Spinner />
			</div>
		);

	if (error)
		return (
			<Callout.Root color="red">
				<Callout.Text>An error has occured</Callout.Text>
			</Callout.Root>
		);

	return <>{name}</>;
};

const TournamentMiniCard: React.FC<unknown> = () => {
	const { isPending, error, data } = useQuery({
		queryKey: ['tournament_history'],
		queryFn: () => fetch(`http://localhost:3004/api/tournament/history`).then((res) => res.json()),
	});

	if (isPending)
		return (
			<div className="flex justify-center">
				<Spinner />
			</div>
		);
	if (error)
		return (
			<Callout.Root color="red">
				<Callout.Text>An error has occured</Callout.Text>
			</Callout.Root>
		);
	return (
		<>
			{data &&
				data.history &&
				data.history.map((ele: TournamentMini, index: number) => (
					<Dialog.Root>
						<Dialog.Trigger>
							<Card m="2" key={index}>
								<Text as="div" size="3" weight="bold">
									{ele.tournament_name}
								</Text>
								<Text as="div" size="1">
									{ele.tournament_date}
								</Text>
							</Card>
						</Dialog.Trigger>
						<Dialog.Content>
							<SingleTournamentCard name={ele.tournament_name} />
						</Dialog.Content>
					</Dialog.Root>
				))}
		</>
	);
};

export default TournamentMiniCard;
