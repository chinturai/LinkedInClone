import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className='bg-white border border-gray-100 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-200 group'>
			<div className='flex flex-col'>
				<Link to={`/profile/${user.username}`} className='flex items-center gap-4 mb-4'>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all duration-300'
					/>
					<div>
						<h3 className='font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors'>
							{user.name}
						</h3>
						<p className='text-gray-600 text-sm line-clamp-1'>{user.headline}</p>
					</div>
				</Link>
				
				<div className='space-y-4'>
					<div className='flex items-center gap-1 text-sm text-gray-500'>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
						</svg>
						<span>{user.connections?.length} connections</span>
					</div>
					
					<button 
						className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
							isConnection 
								? 'bg-gray-50 text-gray-700 hover:bg-gray-100' 
								: 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/25'
						}`}
					>
						{isConnection ? "Connected" : "Connect"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserCard;