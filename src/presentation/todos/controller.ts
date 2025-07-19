import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {

    //DI
    constructor(){}

    public getTodos = async(req: Request, res: Response) => {
        
        const todos = await prisma.todo.findMany();

        res.json( todos );
    }


    public getTodoById = async(req: Request, res: Response) => {

        const id = +req.params.id;

        if( isNaN(id) ){
            res.status(400).json({error: `id argument is not a number`});
            return;
        } 

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        ( todo )
          ? res.json( todo )
          : res.status(404).json({error: `TODO with id: ${ id } not exist`});

    }


    public createTodo = async(req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create( req.body );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json( todo );
    }


    public updateTodo = async(req: Request, res: Response) => {

        const id = +req.params.id;

        const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

        if( error ){
            res.status(400).json({ error });
            return;
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        if( !todo ){
            res.status(404).json({error: `TODO with id: ${ id } not exist`});
            return;
        }

        const updatetodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: updateTodoDto!.values
        });

        res.json( updatetodo );
    }


    public deleteTodo = async(req: Request, res: Response) => {

        const id = +req.params.id;

        if( isNaN(id) ){
            res.status(400).json({error: `id argument is not a number`});
            return;
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        
        if( !todo ){
            res.status(404).json({error: `TODO with id: ${ id } not exist`});
            return;
        }

        const todoDeleted = await prisma.todo.delete({
            where: {
                id: id
            }
        });

        res.json( todoDeleted );
    }

}