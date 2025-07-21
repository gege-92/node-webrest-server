import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";


export class TodoDatasourceImpl implements TodoDatasource {

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromObject( todo );
    }


    async getAll(): Promise<TodoEntity[]> {
        
        const todos = await prisma.todo.findMany();

        return todos.map( todo => TodoEntity.fromObject( todo ));

    }


    async findById(id: number): Promise<TodoEntity> {
        
        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        if( !todo ) throw `Todo id: ${ id } not found`;

        return TodoEntity.fromObject( todo );
    }


    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        
        await this.findById(updateTodoDto.id);

        const updateTodo = await prisma.todo.update({
            where: {
                id: updateTodoDto.id
            },
            data: updateTodoDto!.values
        });

        return TodoEntity.fromObject( updateTodo );
    }


    async deleteById(id: number): Promise<TodoEntity> {
        
        await this.findById( id );

        const todoDeleted = await prisma.todo.delete({
            where: {
                id: id
            }
        });

        return TodoEntity.fromObject( todoDeleted );
    }

}