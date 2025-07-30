// import { Box, Callout, Card, Spinner, Text } from '@radix-ui/themes';
// import { useQuery } from '@tanstack/react-query';

// export interface TournamentMini {
// 	tournament_date: string;
// 	tournament_name: string;
// }

// const TournamentMiniCard: React.FC<unknown> = () => {
// 	const { isPending, error, data } = useQuery({
// 		queryKey: ['tournamentHistory'],
// 		queryFn: () => fetch(`http://localhost:3004/api/tournament/history`).then((res) => res.json()),
// 	});

// 	return (
// 		<div>
// 			<Text weight="bold" as="div" size="3" ml="1" align="center">
// 				Tournament History
// 			</Text>
// 			<Box height="4px" />
// 			{isPending && (
// 				<div className="flex justify-center">
// 					<Spinner />
// 				</div>
// 			)}
// 			{error && (
// 				<Callout.Root color="red">
// 					<Callout.Text>An error has occured</Callout.Text>
// 				</Callout.Root>
// 			)}
// 			{data &&
// 				data.history &&
// 				data.history.map((ele: TournamentMini, index: number) => {
// 					return (
// 						<Card m="2" key={index}>
// 							<Text as="div" size="3" weight="bold">
// 								{ele.tournament_name}
// 							</Text>
// 							<Text as="div" size="1">
// 								{ele.tournament_date}
// 							</Text>
// 						</Card>
// 					);
// 				})}
// 		</div>
// 	);
// };

// export default TournamentMiniCard;
