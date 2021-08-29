from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib import messages
# Create your views here.


@login_required(login_url='/authentication/login')

def index(request):
    categories = Category.objects.all()
    return render(request, "expenses/index.html")

def add_expense(request):
    
    categories = Category.objects.all()
    context = {
        'categories': categories,
        'current_values': request.POST
    }
    

    if request.method == "POST":
        amount = request.POST['amount']
        description = request.POST['description']
        date = request.POST['expense-date']
        category = request.POST['category']
        if not amount:
            messages.error(request, "Please enter valid amount")
            return render(request, "expenses/add_expense.html",context)
        if not description:
            messages.error(request, "Please enter description")
            return render(request, "expenses/add_expense.html",context)

        Expense.objects.create(amount=amount,date=date,category=category,description=description, owner=request.user)
        messages.success(request, "Expense saved successfully")
        return redirect('expenses')

    return render(request, "expenses/add_expense.html",context)