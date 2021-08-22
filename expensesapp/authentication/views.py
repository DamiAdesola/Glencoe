from django.shortcuts import redirect, render
from django.views import View
import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from validate_email import validate_email 
from django.contrib import messages
from django.core.mail import EmailMessage
from django.contrib import auth
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from .utils import TokenGenerator, token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
# Create your views here.

class RegisterationView(View):
    def get(self,request):
        return render(request, 'authentication/register.html')
    
    def post(self,request):
        fullname = request.POST['fullname'].split()
        firstname = fullname[0]
        lastname = ""
        if(len(fullname) > 1):
            lastname = fullname[1]
        
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']



        context = {
            'fieldValues':request.POST
        }

        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                if len(password) < 6:
                    messages.error(request,'Password too short')
                    return render(request, 'authentication/register.html',context)
                
                
                user = User.objects.create_user(username=username,email=email)
                user.first_name = firstname
                user.last_name = lastname
                user.set_password(password)
                user.is_active = False
                user.save()
            
                uidb64 = urlsafe_base64_encode(force_bytes((user.pk)))

                domain = get_current_site(request).domain

                link = reverse('activate',kwargs={'uidb64':uidb64, 'token':token_generator.make_token(user)})
                
                activate_url = 'http://'+domain+link

                email_subject = 'Welcome to Glencoe Expenses: Activate you account'

                activation_template = get_template('authentication/activate-email.html')
                activation_render_data = {'firstname':firstname,'lastname':lastname, 'activate_url':activate_url }
                html_content = activation_template.render(activation_render_data)

                email = EmailMultiAlternatives(
                    email_subject,
                    html_content,
                    'glencoetester@gmail.com',
                    [email],
                )
                email.attach_alternative(html_content, "text/html")
                email.send(fail_silently=False)
                messages.success(request,'Account successfully created')
                return render(request, 'authentication/register.html')
        return render(request, 'authentication/register.html')
        
class VerificationView(View):
    def get(self,request,uidb64, token):
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            
            if not token_generator.check_token(user,token):
                return redirect('login'+'?message='+'User already activated')

            if user.is_active == True:
                return redirect('login')
            
            user.is_active = True
            user.save()

            messages.success(request,'Account succesfully activated')

            return redirect('login')

        except Exception as e:
            pass
        
        return redirect('login')
       
class LoginView(View):
    def get(self,request):
        return render(request,'authentication/login.html')

    def post(self,request):
        username = request.POST['username']
        password = request.POST['password']
        
        if username and password:
            user = auth.authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    auth.login(request,user)
                    messages.success(request, "Welcome, "+user.username+'. You are now logged in.')
                    return redirect('expenses')
                messages.error(request,'Account is not active, please verify email')
                return render(request,'authentication/login.html')
            messages.error(request,'Invalid credentials, please try again')
            return render(request,'authentication/login.html')
        messages.error(request,'Please fill all fields')
        return render(request,'authentication/login.html')

class EmailValidationView(View):
    def post(self,request):
        data = json.loads(request.body)
        email = data['email']

        if not validate_email(email):
            return JsonResponse({'email_error': 'Email is not valid'}, status=400)
        
        if User.objects.filter(email = email).exists():
            return JsonResponse({'email_error': 'Sorry email already exists. Please Login'}, status=409)

        return JsonResponse({'email_valid':True})
class UsernameValidationView(View):
    def post(self,request):
        data = json.loads(request.body)
        username = data['username']

        if not str(username).isalnum():
            return JsonResponse({'username_error': 'Username should only contain alphanumeric characters'}, status=400)
        
        if User.objects.filter(username = username).exists():
            return JsonResponse({'username_error': 'Sorry username already exists'}, status=409)

        return JsonResponse({'username_valid':True})

class LogoutView(View):
    def post(self,request):
        auth.logout(request)
        messages.success(request, 'You have successfully logged out')
        return redirect('login')